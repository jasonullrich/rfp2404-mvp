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
  { name: 'forward', keys: ["ArrowUp", "KeyW"] },
  { name: 'backward', keys: ["ArrowDown", "KeyS"] },
  { name: 'right', keys: ["ArrowRight", "KeyD"] },
  { name: 'left', keys: ["ArrowLeft", "KeyA"] },
]

const Scene = () => {

  const { playersRef: {current: players} } = useContext(GameContext)

  return (
    <KeyboardControls map={keyMap}>
      <Physics>
        {/* <ambientLight intensity={0.1} /> */}
        <directionalLight position={[1, 1, -1]} intensity={3} />
        <Hall />
        {players.map(player => <PlayerCharacter key={player.id} player={player} />)}
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