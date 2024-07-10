import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import RTC from './RTC'
import Scene from './Scene'
import Loading from './Loading'

import GameContext from '../context/GameContext'
import Countdown from './Countdown'

const App = () => {
  // const [gameState, setGameState] = useState('loading')
  const [connected, setConnected] = useState(false)
  const [id, setID] = useState(null)
  const [playerCount, setPlayerCount] = useState(0)
  const [gameState, setGameState] = useState('loading')
  const [startTime, setStartTime] = useState(null)

  const players = useRef({})
  const setPlayers = (newPlayers) => {
    players.current = newPlayers
  }

  // const gameState = (connected && id) ? 'playing' : 'loading'
  console.log(gameState)

  return (
    <>
      <GameContext.Provider
        value={{
          gameState,
          id,
          players,
          setPlayers,
          playerCount,
          setPlayerCount,
          startTime,
        }}
      >
        <RTC
          setConnected={setConnected}
          setGameState={setGameState}
          setStartTime={setStartTime}
          setID={setID}
        >
          <main className="relative aspect-video w-full  ">
            {gameState === 'loading' ? (
              <>
                <Loading />
              </>
            ) : gameState === 'countdown' || gameState === 'race' ? (
              <Countdown />
            ) : null}
            <Canvas>
              <Scene />
            </Canvas>
          </main>
        </RTC>
      </GameContext.Provider>
    </>
  )
}

export default App
