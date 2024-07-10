import React, { createContext, useContext, useEffect, useRef } from 'react'

import RTCContext from '../context/RTCContext'

import { io } from 'socket.io-client'
import GameContext from '../context/GameContext'

const socket = io()

const RTC = ({children, setConnected, setID}) => {
  const pc = useRef(new RTCPeerConnection())
  const dataChannel = useRef(null)

  const { players, setPlayers } = useContext(GameContext)

  useEffect(() => {
    socket.on('connect', async () => {
      console.log('connected')

      dataChannel.current = pc.current.createDataChannel('dataChannel')

      dataChannel.current.onopen = () => {
        console.log('data channel ready')
        setConnected(true)
      }

      dataChannel.current.onmessage = ({data}) => {
        // console.log(data)ww
        const message = JSON.parse(data)
        if (message.players) {
          setPlayers(message.players)
        }
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

    socket.on('join', ({id, name}) => {
      console.log('joined', {id, name})
      setID(id)
      setPlayers(players.map(player => player.id === id ? {
        ...player,
        name
      } : player))
    })

    socket.on('currentPlayers', (currentPlayers) => {
      setPlayers(currentPlayers)
    })

    socket.on('playerJoin', async (newPlayer) => {
      setPlayers([
        players,
        newPlayer
      ])
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
    <RTCContext.Provider value={{socket, dataChannel: dataChannel.current}}>
      {children}
    </RTCContext.Provider>
  )
}

export default RTC