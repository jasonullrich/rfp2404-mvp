import React, { useContext, useEffect, useRef, useState } from 'react'
import RTCContext from '../context/RTCContext'

const Loading = () => {
  const [clicked, setClicked] = useState(false)
  const [waiting, setWaiting] = useState(false)

  const { socket } = useContext(RTCContext)

  const inputRef = useRef()

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [clicked])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('playerName', e.target.name.value)
    setWaiting(true)
  }

  return (
    <>
      <div className="absolute w-full h-full z-10 left-0 top-0">
        <img
          src={'./assets/title.png'}
          className="w-full h-full object-cover"
        />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[10%] p-4 bg-purple-300 text-3xl">
          {!clicked ? (
            <button
              onClick={() => {
                setClicked(true)
              }}
            >
              JOIN
            </button>
          ) : !waiting ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              <input ref={inputRef} name="name" placeholder="ENTER YOUR NAME" />
              <button>READY</button>
            </form>
          ) : (
            <span>Waiting for others.</span>
          )}
        </div>
      </div>
    </>
  )
}

export default Loading
