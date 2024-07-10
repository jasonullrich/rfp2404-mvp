import React, { useContext, useEffect, useState } from 'react'
import GameContext from '../context/GameContext'

const Countdown = () => {
  const [display, setDisplay] = useState(null)

  const { startTime } = useContext(GameContext)

  let interval

  useEffect(() => {
    const getDate = () => {
      const seconds = Math.ceil((new Date(startTime) - new Date()) / 1000)
      if (seconds > 0) {
        setDisplay(seconds)
      } else {
        setDisplay('Go!')
        setTimeout(() => {
          setDisplay(null)
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
      <div className="absolute w-full h-full flex justify-center items-center z-10">
        <span className="text-white text-[20vw]">{display}</span>
      </div>
    </>
  )
}

export default Countdown
