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

io.on('connection', (socket) => {
  console.log('connected')

  const pc = new RTCPeerConnection()

  pc.ondatachannel = ({ channel: dataChannel }) => {

    dataChannel.onopen = () => {
      console.log('data channel open')
      dataChannel.send('hi')
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

})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})