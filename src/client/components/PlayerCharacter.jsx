import React, { useContext, useEffect, useRef } from 'react'
import { BallCollider, CapsuleCollider, RigidBody } from '@react-three/rapier'
import PlayerMesh from './PlayerMesh'
import { Html, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'

import GameContext from '../context/GameContext'
import RTCContext from '../context/RTCContext'

const movementSpeed = 10

const PlayerCharacter = ({ player }) => {
  const { gameState, id, players, playerData } = useContext(GameContext)
  console.log(playerData.current)

  const controlled = player === id
  console.log('controlled:', controlled)

  const { dataChannel } = useContext(RTCContext)

  const initialPosition = { x: 0, y: 0.75, z: -players[player].num * 2.3 }
  console.log(initialPosition)

  useEffect(() => {
    rbRef.current.setTranslation(initialPosition)
  }, [])

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
          playerData.current[player]?.position &&
          playerData.current[player]?.rotation
        ) {
          rbRef.current.setTranslation(playerData.current[player].position)
          rbRef.current.setRotation(playerData.current[player].rotation)
        }
      }
    }
  })

  console.log('rendering:', player, 'at', [0, 0.5, -players[player].num * 2.3])
  // console.log(player, 'sleeping', rbRef.current?.isSleeping())
  // console.log(player, 'dynamic', rbRef.current?.isDynamic())
  // console.log(player, 'enabled', rbRef.current?.isEnabled())
  // console.log(player, 'fixed', rbRef.current?.isFixed())
  // console.log(player, 'kinematic', rbRef.current?.isKinematic())
  // console.log(player, 'moving', rbRef.current?.isMoving())
  // console.log(player, 'valid', rbRef.current?.isValid())
  return (
    <RigidBody
      ref={rbRef}
      position={[initialPosition.x, initialPosition.y, initialPosition.z]}
      mass={1}
      colliders={false}
      enabledRotations={[false, true, false]}
      friction={0}
      type={controlled ? 'dynamic' : 'kinematicPosition'}
      // type={'fixed'}
      canSleep={false}
    >
      {gameState === 'race' ? (
        <Html center position={[0, 1.1, 0]}>
          <span className="text-white text-xl font-bold whitespace-nowrap">
            {players[player].name}
          </span>
        </Html>
      ) : null}
      <BallCollider args={[0.75]} />
      <PlayerMesh player={player} ref={gRef} position={[0, -0.75, 0]} />
    </RigidBody>
  )
}

export default PlayerCharacter
