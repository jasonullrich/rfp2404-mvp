import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshToonMaterial } from 'three'
import { RigidBody } from '@react-three/rapier'

export function Hall(props) {
  const { nodes, materials } = useGLTF('/assets/hall.glb')
  const mat = useRef(new MeshToonMaterial())
  mat.current.map = materials.Hall.map
  return (
    <group {...props} dispose={null}>
      <RigidBody colliders={'trimesh'} type="fixed" friction={0} >
        <mesh castShadow receiveShadow geometry={nodes.Hall.geometry} material={mat.current} />
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/assets/hall.glb')

export default Hall