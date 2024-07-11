import React, { useContext, useRef } from 'react'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import PlayerMesh from './PlayerMesh'
import { Html, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'

import GameContext from '../context/GameContext'
import RTCContext from '../context/RTCContext'

const movementSpeed = 10

const PlayerCharacter = ({ player }) => {
  const { gameState, id, players } = useContext(GameContext)
  console.log(players.current)

  const controlled = player === id
  console.log('controlled:', controlled)

  const { dataChannel } = useContext(RTCContext)

  const [, get] = useKeyboardControls()
  const rbRef = useRef()
  const gRef = useRef()
  const linVel = useRef(new Vector3())
  const angVel = useRef(new Vector3())
  const direction = useRef(new Vector3())
  const goalVel = useRef(new Vector3())

  useFrame((state, delta) => {
    if (gameState === 'race' || gameState === 'finished') {
      // console.log(players.current)
      if (controlled) {
        dataChannel.send(
          JSON.stringify({
            id,
            position: rbRef.current.translation(),
            rotation: rbRef.current.rotation(),
          })
        )
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
          gRef.current.rotation.set(0, -0.6, 0)
        }
        if (get()['left']) {
          angVel.current.y = 1.5
          gRef.current.rotation.set(0, 0.6, 0)
        }
        let mag = linVel.current.length()
        linVel.current.normalize()
        linVel.current.setLength(mag)
        linVel.current.y = rbRef.current.linvel().y
        rbRef.current.setLinvel(linVel.current, true)
        rbRef.current.setAngvel(angVel.current, true)
      } else {
        if (
          players.current[player]?.position &&
          players.current[player]?.rotation
        ) {
          rbRef.current.setTranslation(players.current[player].position)
          rbRef.current.setRotation(players.current[player].rotation)
        }
      }
    }
  })

  console.log(player)

  return (
    <RigidBody
      ref={rbRef}
      position={[0, 0.5, -players.current[player].num * 2.3]}
      mass={1}
      colliders={false}
      enabledRotations={[false, true, false]}
      friction={0}
      type={controlled ? 'dynamic' : 'kinematicPosition'}
    >
      {gameState === 'race' ? (
        <Html center position={[0, 1.1, 0]}>
          <span className="text-white text-xl font-bold whitespace-nowrap">
            {players.current[player].name}
          </span>
        </Html>
      ) : null}
      <CapsuleCollider args={[0.125, 0.75]} />
      <PlayerMesh player={player} ref={gRef} position={[0, -0.75, 0]} />
    </RigidBody>
  )
}

export default PlayerCharacter
