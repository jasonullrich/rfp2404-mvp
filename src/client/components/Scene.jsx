import React from 'react'

import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import Hall from './Hall'
import Player from './PlayerCharacter'

import { ColorManagement } from 'three'
ColorManagement.enabled = true

const keyMap = [
  { name: 'forward', keys: ["ArrowUp", "KeyW"] },
  { name: 'backward', keys: ["ArrowDown", "KeyS"] },
  { name: 'right', keys: ["ArrowRight", "KeyD"] },
  { name: 'left', keys: ["ArrowLeft", "KeyA"] },
]

const Scene = () => {

  return (
    <KeyboardControls map={keyMap}>
      <Physics>
        {/* <ambientLight intensity={0.1} /> */}
        <directionalLight position={[1, 1, -1]} intensity={3} />
        <Hall />
        <Player active={true}/>
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