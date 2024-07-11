import React, { useContext, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshBasicMaterial, MeshToonMaterial } from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import RTCContext from '../context/RTCContext'

export function Hall(props) {
  const { nodes, materials } = useGLTF('/assets/hall.glb')

  const mat = useRef(new MeshToonMaterial())
  const invis = useRef(new MeshBasicMaterial({ visible: false }))
  mat.current.map = materials.Hall.map

  const { socket } = useContext(RTCContext)

  return (
    <group {...props} dispose={null}>
      <RigidBody colliders={'trimesh'} type="fixed" friction={0}>
        <mesh geometry={nodes.Hall.geometry} material={mat.current} />
      </RigidBody>
      <RigidBody
        colliders={'cuboid'}
        type="fixed"
        sensor
        onIntersectionEnter={() => {
          console.log('finish')
          socket.emit('progress', 'finish')
        }}
      >
        <mesh geometry={nodes.Finish.geometry} material={invis} />
      </RigidBody>
      <RigidBody
        colliders={'cuboid'}
        type="fixed"
        sensor
        onIntersectionEnter={() => {
          console.log('half')
          socket.emit('progress', 'half')
        }}
      >
        <mesh geometry={nodes.Half.geometry} material={invis} />
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/assets/hall.glb')

export default Hall
