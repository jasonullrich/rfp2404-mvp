import React, { useContext, useRef } from 'react'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import PlayerMesh from './PlayerMesh'
import { Html, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'

import GameContext from '../context/GameContext'
import RTCContext from '../context/RTCContext'

const movementSpeed = 10

const PlayerCharacter = ({player}) => {

  const { gameState, id } = useContext(GameContext)
  console.log(gameState)

  const controlled = player.id === id

  const { dataChannel } = useContext(RTCContext)

  const [, get] = useKeyboardControls()
  const rbRef = useRef();
  const gRef = useRef();
  const linVel = useRef(new Vector3())
  const angVel = useRef(new Vector3())
  const direction = useRef(new Vector3())
  const goalVel = useRef(new Vector3())

  useFrame((state, delta) => {
    if (gameState === 'playing') {
      // console.log(rbRef.current.translation())
      if (controlled) {
        dataChannel.send(JSON.stringify({id, position: rbRef.current.translation()}))
        let currentVel = linVel.current
        gRef.current.getWorldDirection(direction.current)
        angVel.current.x = 0
        angVel.current.y = 0
        angVel.current.z = 0
        gRef.current.rotation.set(0, 0, 0)
        if (get()['backward']) {
          goalVel.current.copy(direction.current)
          goalVel.current.setLength(-movementSpeed)
          linVel.current.lerp(goalVel.current, delta)
        }
        if (get()['forward']) {
          goalVel.current.copy(direction.current)
          goalVel.current.setLength(movementSpeed)
          linVel.current.lerp(goalVel.current, delta)
        }
        if (get()['right']) {
          angVel.current.y = -1.5
          gRef.current.rotation.set(0, -.6, 0)
        }
        if (get()['left']) {
          angVel.current.y = 1.5
          gRef.current.rotation.set(0, .6, 0)
        }
        let mag = linVel.current.length()
        linVel.current.y = 0
        linVel.current.normalize()
        linVel.current.setLength(mag)
        rbRef.current.setLinvel(linVel.current, true)
        rbRef.current.setAngvel(angVel.current, true)
      } else {
        if (player.position) {
          rbRef.current.setTranslation(player.position)
        }
      }
    }
  })

  console.log(player)

  return (
    <RigidBody ref={rbRef} position={[0, 1, 0]} colliders={false} enabledRotations={[false, true, false]} friction={0} type={controlled ? 'dynamic' : 'kinematicPosition'}>
      {gameState === 'playing' ? <Html center position={[0, 1.1, 0]}>
        <span className='text-white text-xl font-bold'>{player.name}</span>
      </Html> : null }
      <CapsuleCollider args={[.125, .75]} />
      <PlayerMesh player={player} ref={gRef} position={[0, -.75, 0]} />
    </RigidBody>
  )
}

export default PlayerCharacter
