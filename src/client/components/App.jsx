import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import RTC from './RTC'
import Scene from './Scene'

const App = () => {

  const [gameState, setGameState] = useState('loading')

  const updateState = (newState) => {
    setGameState(newState)
  }

  return (
    <>
    <RTC updateState={updateState}>
      <main className='relative w-full aspect-video'>
        { gameState === 'loading' ? <img src={'./assets/title.png'} className='absolute w-full h-full object-cover z-10' /> : null }
          <Canvas >
            <Scene />
          </Canvas>
      </main>
    </RTC>
    </>
  )
}

export default App