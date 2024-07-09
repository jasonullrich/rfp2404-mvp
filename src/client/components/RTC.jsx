import React, { createContext, useEffect, useRef } from 'react'

import { io } from 'socket.io-client'

const socket = io()

const RTCContext = createContext()

const RTC = ({children}) => {
  const pc = useRef(new RTCPeerConnection())
  const dataChannel = useRef(null)

  useEffect(() => {
    socket.on('connect', async () => {
      console.log('connected')

      dataChannel.current = pc.current.createDataChannel('dataChannel')

      dataChannel.current.onopen = () => {
        console.log('data channel ready')
      }

      dataChannel.current.onmessage = ({data}) => {
        console.log(data)
      }

      const offer = await pc.current.createOffer()
      console.log('created offer:', offer)
      await pc.current.setLocalDescription(offer)
      socket.emit('signal', { description: offer })

    })

    socket.on('signal', async ({ description, candidate }) => {
      if (description) {
        console.log('recieved answer:', description)
        await pc.current.setRemoteDescription(description)
      } else if (candidate) {
        console.log('recieved candidate:', candidate)
        pc.current.addIceCandidate(candidate)
      }
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    pc.current.onicecandidate = ({ candidate }) => {
      console.log('generated candidate:', candidate)
      if (candidate) {
        socket.emit('signal', { candidate })
      }
    }

    return () => {
      socket.off('connect')
      socket.off('signal')
      socket.off('disconnect')
    }
  }, [])

  return (
    <RTCContext.Provider value={{}}>
      {children}
    </RTCContext.Provider>
  )
}

export default RTC