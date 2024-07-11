import React, { useContext } from 'react'

import { KeyboardControls, OrbitControls, useProgress } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import Hall from './Hall'
import PlayerCharacter from './PlayerCharacter'

import GameContext from '../context/GameContext'

import { ColorManagement } from 'three'
ColorManagement.enabled = true

const keyMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
]

const Scene = () => {
  const { players, playerData, playerCount } = useContext(GameContext)
  console.log(playerData.current)
  console.log('player count:', playerCount)

  const { active: loading } = useProgress()

  return (
    <>
      <KeyboardControls map={keyMap}>
        {/* <OrbitControls /> */}
        <Physics>
          {/* <ambientLight intensity={0.1} /> */}
          <directionalLight position={[1, 1, -1]} intensity={3} />
          <Hall />
          {!loading
            ? Object.keys(players).map((player) => (
                <PlayerCharacter key={player} player={player} />
              ))
            : null}
        </Physics>
      </KeyboardControls>
    </>
  )
}

export default Scene
