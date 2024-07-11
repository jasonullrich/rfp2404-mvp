import 'dotenv/config'

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import wrtc from 'wrtc'
import sql from '../db/index.js'
import { v4 as uuid } from 'uuid'

const app = express()
const server = createServer(app)

const io = new Server(server)
const { RTCPeerConnection } = wrtc

const PORT = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/results', async (req, res) => {
  const results = await sql`
    select time, player
    from times
    order by time
    limit 10
  `
  console.log(results)
  res.json(results)
})
app.get('/results/:id', async (req, res) => {
  const id = req.params.id
  const results = await sql`
    select time, player
    from times
    where race_id = ${id}
  `
  console.log(results)
  res.json(results)
})

const PLAYER_COUNT = 1
const LAPS = 1

let playerServerData = {}
let playerClientData = {}
let playerNums = {}
let gameLoop
let startTime
let raceID = uuid()

const reset = () => {
  console.log('reset')
  clearInterval(gameLoop)
  gameLoop = null
  playerServerData = {}
  playerClientData = {}
  playerNums = {}
  io.disconnectSockets()
  raceID = uuid()
}

io.on('connection', (socket) => {
  console.log('connected')

  socket.emit('join', socket.id)

  if (Object.keys(playerNums).length < PLAYER_COUNT) {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
          ],
        },
      ],
    })

    playerServerData[socket.id] = {
      pc,
      ready: false,
      progress: {
        half: false,
        finish: false,
      },
    }

    let num
    for (let i = 0; i < PLAYER_COUNT; i++) {
      if (!playerNums[i]) {
        playerNums[i] = true
        num = i
        break
      }
    }

    console.log(playerNums)

    playerClientData[socket.id] = {
      id: socket.id,
      num,
      position: {},
      lap: 1,
    }

    console.log(Object.keys(playerClientData))

    socket.emit('currentPlayers', playerClientData)

    pc.ondatachannel = ({ channel: dataChannel }) => {
      playerServerData[socket.id].dataChannel = dataChannel

      dataChannel.onopen = () => {
        console.log('data channel open')
      }

      dataChannel.onmessage = ({ data }) => {
        const message = JSON.parse(data)
        // console.log(message)
        if (message.position && playerClientData[message.id]) {
          playerClientData[message.id].position = message.position
          playerClientData[message.id].rotation = message.rotation
        }
      }
    }

    socket.on('signal', async ({ description, candidate }) => {
      if (description) {
        // console.log('recieved offer:', description)
        await pc.setRemoteDescription(description)
        const answer = await pc.createAnswer()
        // console.log('created answer:', answer)
        await pc.setLocalDescription(answer)
        socket.emit('signal', { description: answer })
      } else if (candidate) {
        // console.log('recieved candidate:', candidate)
        if (candidate.candidate === '') return
        try {
          await pc.addIceCandidate(candidate)
          // console.log('added candidate')
        } catch (err) {
          console.log(err)
        }
      }
    })

    pc.onicecandidate = ({ candidate }) => {
      // console.log('generated candidate:', candidate)
      if (candidate) {
        socket.emit('signal', { candidate })
      }
    }

    socket.on('playerName', async (name) => {
      console.log(name)
      playerClientData[socket.id].name = name
      playerServerData[socket.id].ready = true
      // socket.emit('join', socket.id)
      // socket.broadcast.emit('playerJoin', playerData[socket.id])
      io.emit('currentPlayers', playerClientData)

      if (
        Object.keys(playerServerData).length === PLAYER_COUNT &&
        Object.values(playerServerData).every((player) => player.ready)
      ) {
        startTime = Date.now() + 3000
        io.emit('status', {
          state: 'countdown',
          data: { startTime },
        })

        setTimeout(() => {
          io.emit('status', { state: 'race', data: { raceID } })
        }, 3030)

        if (!gameLoop) {
          gameLoop = setInterval(() => {
            for (let player of Object.values(playerServerData)) {
              if (
                player.dataChannel &&
                player.dataChannel.readyState === 'open'
              )
                try {
                  player.dataChannel.send(
                    JSON.stringify({ players: playerClientData })
                  )
                } catch (err) {
                  continue
                }
            }
          }, 1000 / 60)
        }
      }
    })

    socket.on('progress', async (progress) => {
      if (progress === 'half') {
        if (playerServerData[socket.id].progress.half) return
        playerServerData[socket.id].progress.half = true
      } else if (progress === 'finish') {
        if (playerServerData[socket.id].progress.finish) return
        if (playerServerData[socket.id].progress.half) {
          playerServerData[socket.id].progress.finish = true
          playerServerData[socket.id].progress = {
            half: false,
            finish: false,
          }
          playerClientData[socket.id].lap++
          socket.emit('lap', playerClientData[socket.id].lap)
          if (playerClientData[socket.id].lap > LAPS) {
            socket.emit('status', { state: 'finished' })
            await sql`
              insert into times (time, race_id, player)
              values (${Date.now() - startTime}, ${raceID}, ${
              playerClientData[socket.id].name
            })
            `
          }
        }
      }
      if (
        Object.values(playerClientData).every((player) => player.lap > LAPS)
      ) {
        setTimeout(() => {
          io.emit('status', { state: 'results' })
          reset()
        }, 3000)
      }
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
      delete playerClientData[socket.id]
      delete playerServerData[socket.id]
      delete playerNums[num]

      console.log(
        Object.keys(playerClientData).length,
        Object.keys(playerNums).length,
        Object.keys(playerServerData).length
      )

      io.emit('playerDisconnect', socket.id)
      io.emit('currentPlayers', playerClientData)

      if (Object.keys(playerClientData).length === 0) {
        reset()
      }
    })
  }
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})
