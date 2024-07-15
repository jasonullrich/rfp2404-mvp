import React, { useEffect, useState } from 'react'

import format from '../../lib/format.js'

const HighScores = () => {
  const [results, setResults] = useState([])

  const getResults = async () => {
    const dummyData = Array(10)
      .fill(0)
      .map(() => ({ player: '??????', time: null }))
    const res = await fetch(`/results`)
    const data = await res.json()
    if (data) {
      setResults([...data, ...dummyData].slice(0, 10))
    }
  }

  useEffect(() => {
    getResults()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center gap-8 z-10 text-white">
        <h1 className="text-6xl">High Scores</h1>
        <table className="text-3xl">
          <tbody>
            {results.map((result, i) => {
              return (
                <tr key={i}>
                  <td className="px-8">{result.player}</td>
                  <td className="px-8">
                    {result.time ? format(result.time) : '--:--:---'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default HighScores
