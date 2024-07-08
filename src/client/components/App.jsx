import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'

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
    <main className='w-full aspect-video'>
    <Canvas>
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color={'green'} />
      </mesh>
    </Canvas>
    </main>
    </>
  )
}

export default App