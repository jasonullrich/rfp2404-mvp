import React, { createContext, useContext, useEffect, useRef } from 'react'
import adapter from 'webrtc-adapter'

import RTCContext from '../context/RTCContext'

import { io } from 'socket.io-client'
import GameContext from '../context/GameContext'

const socket = io()

const RTC = ({ children, setConnected, setID, setGameState, setStartTime }) => {
  const pc = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
          ],
        },
      ],
    })
  )
  const dataChannel = useRef(null)

  const { players, setPlayerCount } = useContext(GameContext)

  useEffect(() => {
    socket.on('connect', async () => {
      console.log('connected')

      dataChannel.current = pc.current.createDataChannel('dataChannel')

      dataChannel.current.onopen = () => {
        console.log('data channel ready')
        setConnected(true)
      }

      dataChannel.current.onmessage = ({ data }) => {
        // console.log(data)
        const message = JSON.parse(data)
        // console.log(message)
        if (message.players) {
          players.current = message.players
        }
      }

      const offer = await pc.current.createOffer()
      // console.log('created offer:', offer)
      await pc.current.setLocalDescription(offer)
      socket.emit('signal', { description: offer })
    })

    socket.on('signal', async ({ description, candidate }) => {
      if (description) {
        // console.log('recieved answer:', description)
        await pc.current.setRemoteDescription(description)
      } else if (candidate) {
        // console.log('recieved candidate:', candidate)
        pc.current.addIceCandidate(candidate)
      }
    })

    socket.on('status', ({ state, data }) => {
      console.log(state)
      setGameState(state)
      if (data?.startTime) {
        setStartTime(data.startTime)
      }
    })

    socket.on('join', (id) => {
      console.log('joined', id)
      setID(id)
    })

    socket.on('currentPlayers', (currentPlayers) => {
      console.log('current players:', currentPlayers)
      players.current = currentPlayers
    })

    socket.on('playerJoin', (newPlayer) => {
      players.current = {
        ...players.current,
        ...newPlayer,
      }
      setPlayerCount(Object.keys(players.current).length)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    pc.current.onicecandidate = ({ candidate }) => {
      // console.log('generated candidate:', candidate)
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
    <RTCContext.Provider value={{ socket, dataChannel: dataChannel.current }}>
      {children}
    </RTCContext.Provider>
  )
}

export default RTC
