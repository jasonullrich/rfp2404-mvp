import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshToonMaterial } from 'three'

export function Hall(props) {
  const { nodes, materials } = useGLTF('/assets/hall.glb')
  const mat = useRef(new MeshToonMaterial())
  console.log('hi', materials.Walls)
  mat.current.map = materials.Hall.map
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Hall.geometry} material={mat.current} />
    </group>
  )
}

useGLTF.preload('/assets/hall.glb')

export default Hall