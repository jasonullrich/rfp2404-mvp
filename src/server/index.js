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

const PLAYER_COUNT = 2

const playerConnections = {}
const playerData = {}
let gameLoop

io.on('connection', (socket) => {
  console.log('connected')

  const pc = new RTCPeerConnection()

  playerConnections[socket.id] = {
    pc,
    ready: false,
  }

  playerData[socket.id] = {
    id: socket.id,
    num: Object.keys(playerData).length,
    position: {},
  }

  console.log(Object.keys(playerData))

  socket.emit('currentPlayers', playerData)

  pc.ondatachannel = ({ channel: dataChannel }) => {
    playerConnections[socket.id].dataChannel = dataChannel

    dataChannel.onopen = () => {
      console.log('data channel open')
    }

    dataChannel.onmessage = ({ data }) => {
      const message = JSON.parse(data)
      // console.log(message)
      if (message.position) {
        playerData[message.id].position = message.position
        playerData[message.id].rotation = message.rotation
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
    playerData[socket.id].name = name
    playerConnections[socket.id].ready = true
    socket.emit('join', socket.id)
    // socket.broadcast.emit('playerJoin', playerData[socket.id])
    io.emit('playerJoin', { [socket.id]: playerData[socket.id] })

    if (
      Object.keys(playerConnections).length === PLAYER_COUNT &&
      Object.values(playerConnections).every((player) => player.ready)
    ) {
      io.emit('status', {
        state: 'countdown',
        data: { startTime: Date.now() + 3000 },
      })

      setTimeout(() => {
        io.emit('status', { state: 'race' })
      }, 3030)

      if (!gameLoop) {
        gameLoop = setInterval(() => {
          for (let player of Object.values(playerConnections)) {
            if (player.dataChannel && player.dataChannel.readyState === 'open')
              player.dataChannel.send(JSON.stringify({ players: playerData }))
          }
        }, 1000 / 120)
      }
    }
  })

  socket.on('disconnect', () => {
    delete playerData[socket.id]
    delete playerConnections[socket.id]

    if (Object.keys(playerData).length === 0) {
      clearInterval(gameLoop)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})
