import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshBasicMaterial, MeshToonMaterial } from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

export function Hall(props) {
  const { nodes, materials } = useGLTF('/assets/hall.glb')
  const mat = useRef(new MeshToonMaterial())
  const invis = useRef(new MeshBasicMaterial({ visible: false }))
  mat.current.map = materials.Hall.map
  return (
    <group {...props} dispose={null}>
      <RigidBody colliders={'trimesh'} type="fixed" friction={0}>
        <mesh geometry={nodes.Hall.geometry} material={mat.current} />
      </RigidBody>
      <RigidBody
        colliders={'cuboid'}
        type="fixed"
        sensor
        onIntersectionEnter={() => console.log('finished')}
      >
        <mesh geometry={nodes.Finish.geometry} material={invis} />
      </RigidBody>
      <RigidBody
        colliders={'cuboid'}
        type="fixed"
        sensor
        onIntersectionEnter={() => console.log('half')}
      >
        <mesh geometry={nodes.Half.geometry} material={invis} />
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/assets/hall.glb')

export default Hall
