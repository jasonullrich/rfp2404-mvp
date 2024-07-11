import React, { useContext, useEffect, useState } from 'react'
import GameContext from '../context/GameContext'

import format from '../../lib/format.js'

const Results = () => {
  const [results, setResults] = useState([])
  const { raceID } = useContext(GameContext)

  // const raceID = 'one'
  const getResults = async () => {
    const res = await fetch(`/results/${raceID}`)
    const data = await res.json()
    setResults(data)
  }

  useEffect(() => {
    getResults()
  }, [])

  return (
    <div className="absolute w-full h-full flex flex-col justify-center items-center z-1 pointer-events-none select-none text-white bg-[#121212] left-0 top-0">
      <img
        src="/assets/results.png"
        className="absolute w-full h-full object-cover z-5 opacity-25"
      />
      <div className="flex flex-col items-center gap-8 z-10">
        <h1 className="text-6xl">Results</h1>
        <table className="text-3xl">
          <tbody>
            {results.map((result, i) => {
              return (
                <tr key={i}>
                  <td className="px-8">{result.player}</td>
                  <td className="px-8">{format(result.time)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Results
