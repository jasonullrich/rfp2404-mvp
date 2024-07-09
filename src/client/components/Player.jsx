import React, { useRef } from 'react'
import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { MeshToonMaterial } from 'three'

export function Player(props) {
  const { nodes, materials } = useGLTF('/assets/player.glb')

  const mat = useRef(new MeshToonMaterial())
  mat.current.map = materials.kart.map

  return (
    <group {...props} dispose={null}>
      <PerspectiveCamera position={[0, 1.5, -5]} rotation={[0, Math.PI, 0]} makeDefault/>
      <mesh castShadow receiveShadow geometry={nodes.kart.geometry} material={mat.current} />
      <mesh castShadow receiveShadow geometry={nodes.daria.geometry} material={mat.current} />
    </group>
  )
}

useGLTF.preload('/assets/player.glb')

export default Player
