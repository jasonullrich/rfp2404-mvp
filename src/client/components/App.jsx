import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import RTC from './RTC'
import Scene from './Scene'
import Loading from './Loading'

import GameContext from '../context/GameContext'
import HUD from './HUD'

const App = () => {
  // const [gameState, setGameState] = useState('loading')
  const [connected, setConnected] = useState(false)
  const [id, setID] = useState(null)
  const [playerCount, setPlayerCount] = useState(0)
  const [gameState, setGameState] = useState('loading')
  const [startTime, setStartTime] = useState(null)
  const [lap, setLap] = useState(1)

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
          lap,
        }}
      >
        <RTC
          setConnected={setConnected}
          setGameState={setGameState}
          setStartTime={setStartTime}
          setID={setID}
          setLap={setLap}
        >
          <main className="relative aspect-video w-full  ">
            {gameState === 'loading' || gameState === 'results' ? (
              <>
                <Loading />
              </>
            ) : gameState === 'countdown' ||
              gameState === 'race' ||
              gameState === 'finished' ? (
              <HUD />
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
