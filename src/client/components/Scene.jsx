import React, { useContext } from 'react'

import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import Hall from './Hall'
import PlayerCharacter from './PlayerCharacter'

import GameContext from '../context/GameContext'

import { ColorManagement } from 'three'
import { useFrame } from '@react-three/fiber'
ColorManagement.enabled = true

const keyMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
]

const Scene = () => {
  const { players, playerCount } = useContext(GameContext)
  console.log(players.current)
  console.log('player count:', playerCount)

  return (
    <KeyboardControls map={keyMap}>
      <Physics>
        {/* <ambientLight intensity={0.1} /> */}
        <directionalLight position={[1, 1, -1]} intensity={3} />
        <Hall />
        {Array.from({ length: playerCount }).map((v, i) => (
          <PlayerCharacter
            key={Object.keys(players.current)[i]}
            player={Object.keys(players.current)[i]}
          />
        ))}
        {/* <Player active={false}/> */}
        {/* <mesh>
          <boxGeometry />
          <meshBasicMaterial color={'green'} />
          </mesh> */}
      </Physics>
    </KeyboardControls>
  )
}

export default Scene
