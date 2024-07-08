import React, { useEffect } from 'react'

import { io } from 'socket.io-client'

const socket = io()

const App = () => {

  useEffect(() => {
    socket.on('connect', async () => {
      console.log('connected')
    })
  }, [])

  return (
    <>
      Hi.
    </>
  )
}

export default App