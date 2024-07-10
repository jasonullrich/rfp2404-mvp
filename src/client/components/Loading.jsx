import React, { useContext, useState } from 'react'
import RTCContext from '../context/RTCContext'

const Loading = ({setPlayerName}) => {
  const [clicked, setClicked] = useState(false)

  const { socket } = useContext(RTCContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('playerName', e.target.name.value)
  }

  return (
    <>
    <div className="absolute w-full h-full z-10" >
      <img src={'./assets/title.png'} className='w-full h-full object-cover' />
      <div className='absolute left-1/2 -translate-x-1/2 bottom-[10%] p-4 bg-purple-300 text-3xl'>
      {!clicked ? <button onClick={() => setClicked(true)}>JOIN</button> : <form onSubmit={handleSubmit}><input name="name" placeholder='ENTER YOUR NAME' /></form>}
      </div>
    </div>
    </>
  )
}

export default Loading