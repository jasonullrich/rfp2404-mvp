import React, { useContext, useEffect, useState } from 'react'
import GameContext from '../context/GameContext'

const HUD = () => {
  const [countdown, setCountdown] = useState(null)

  const { gameState, startTime, lap } = useContext(GameContext)

  let interval

  useEffect(() => {
    const getDate = () => {
      const seconds = Math.ceil((new Date(startTime) - new Date()) / 1000)
      if (seconds > 0) {
        setCountdown(seconds)
      } else {
        setCountdown('Go!')
        setTimeout(() => {
          setCountdown(null)
          clearInterval(interval)
        }, 1000)
      }
    }
    getDate()
    interval = setInterval(() => {
      getDate()
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="absolute w-full h-full flex justify-center items-center z-10 pointer-events-none select-none left-0 top-0">
        {countdown ? (
          <span className="text-white text-[20vw]">{countdown}</span>
        ) : null}
        {gameState === 'finished' ? (
          <span className="text-white text-[20vw]">Finished!</span>
        ) : null}
        {gameState === 'race' ? (
          <span className="absolute text-white text-[10vw] right-8 bottom-8">
            {lap}/3
          </span>
        ) : null}
      </div>
    </>
  )
}

export default HUD
