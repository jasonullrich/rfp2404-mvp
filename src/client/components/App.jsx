import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import RTC from './RTC'
import Scene from './Scene'
import Loading from './Loading'

import GameContext from '../context/GameContext'

const App = () => {

  // const [gameState, setGameState] = useState('loading')
  const [connected, setConnected] = useState(false)
  const [id, setID] = useState(null)

  const playersRef = useRef([])
  const setPlayers = (newPlayers) => {
    playersRef.current = newPlayers
  }

  const gameState = (connected && id) ? 'playing' : 'loading'
  console.log(gameState)

  return (
    <>
    <GameContext.Provider value={{gameState, id, playersRef, setPlayers}}>
      <RTC setConnected={setConnected} setID={setID}>
        <main className='relative w-full aspect-video'>
          { gameState === 'loading' ? <>
          <Loading />
          </> : null }
            <Canvas >
              <Scene />
            </Canvas>
        </main>
      </RTC>
    </GameContext.Provider>
    </>
  )
}

export default App