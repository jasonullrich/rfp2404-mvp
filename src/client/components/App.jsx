import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import RTC from './RTC'
import Scene from './Scene'
import Loading from './Loading'

import GameContext from '../context/GameContext'
import HUD from './HUD'
import Results from './Results'
import HighScores from './HighScores'
import Footer from './Footer'

const App = () => {
  const [id, setID] = useState(null)
  const [raceID, setRaceID] = useState(null)
  const [players, setPlayers] = useState({})
  const [playerCount, setPlayerCount] = useState(0)
  const [gameState, setGameState] = useState('loading')
  const [startTime, setStartTime] = useState(null)
  const [lap, setLap] = useState(1)

  const playerData = useRef({})

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
          playerData,
          playerCount,
          setPlayerCount,
          startTime,
          lap,
          raceID,
          setRaceID,
        }}
      >
        <RTC
          setGameState={setGameState}
          setStartTime={setStartTime}
          setID={setID}
          setLap={setLap}
        >
          <main className="relative aspect-video w-full max-w-[1280px] m-4">
            <Canvas>
              <Scene />
            </Canvas>
            {gameState === 'loading' ? (
              <>
                <Loading />
              </>
            ) : gameState === 'countdown' ||
              gameState === 'race' ||
              gameState === 'finished' ? (
              <HUD />
            ) : gameState === 'results' ? (
              <Results />
            ) : null}
          </main>
          <HighScores />
          <Footer />
        </RTC>
      </GameContext.Provider>
    </>
  )
}

export default App
