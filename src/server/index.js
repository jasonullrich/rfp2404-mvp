import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import wrtc from 'wrtc'

const app = express()
const server = createServer(app)

const io = new Server(server)
const { RTCPeerConnection } = wrtc

const PORT = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, '../../dist')))

const players = {}
let gameLoop

io.on('connection', (socket) => {
  console.log('connected')

  const pc = new RTCPeerConnection()

  players[socket.id] = {
    id: socket.id,
    pc,
    num: Object.keys(players).length,
  }

  socket.emit('currentPlayers', Object.values(players).map(p => ({id: p.id, name: p.name})))

  pc.ondatachannel = ({ channel: dataChannel }) => {
    players[socket.id].dataChannel = dataChannel

    dataChannel.onopen = () => {
      console.log('data channel open')
    }

    dataChannel.onmessage = ({ data }) => {
      const message = JSON.parse(data)
      // console.log(message)
      if (message.position) {
        players[message.id].position = message.position
      }
    }
  }

  socket.on('signal', async ({ description, candidate }) => {
    if (description) {
      console.log('recieved offer:', description)
      await pc.setRemoteDescription(description)
      const answer = await pc.createAnswer()
      console.log('created answer:', answer)
      await pc.setLocalDescription(answer)
      socket.emit('signal', { description: answer })
    } else if (candidate) {
      console.log('recieved candidate:', candidate)
      try {
        await pc.addIceCandidate(candidate)
        console.log('added candidate')
      } catch (err) {
        console.log(err)
      }
    }
  })

  pc.onicecandidate = ({ candidate }) => {
    console.log('generated candidate:', candidate)
    if (candidate) {
      socket.emit('signal', { candidate })
    }
  }

  socket.on('playerName', async (name) => {
    console.log(name)
    players[socket.id].name = name
    socket.emit('join', {id: socket.id, name})
    socket.broadcast.emit('playerJoin', {id: socket.id, name, num: players[socket.id].num})

    if (!gameLoop)
      gameLoop = setInterval(() => {
        for (let player of Object.values(players)) {
          if (player.dataChannel && player.dataChannel.readyState === 'open')
          player.dataChannel.send(JSON.stringify({
            players: Object.values(players).map(p => ({
              id: p.id,
              name: p.name,
              position: p.position
            }))
          })
        )
        }
      }, 1000 / 120)
  })

  socket.on('disconnect', () => {
    delete players[socket.id]

    if (Object.keys(players).length === 0) {
      clearInterval(gameLoop)
    }
  })

})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})