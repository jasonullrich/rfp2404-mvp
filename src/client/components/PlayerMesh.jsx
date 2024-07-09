import React, { forwardRef, useEffect, useRef } from 'react'
import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { MeshToonMaterial } from 'three'

const PlayerMesh = forwardRef(({active, position}, gRef) => {
  const { nodes, materials } = useGLTF('/assets/player.glb')

  const lightRef = useRef()

  const mat = useRef(new MeshToonMaterial())
  mat.current.map = materials.kart.map

  // useEffect(() => {
  //   lightRef.current.target = gRef.current
  // }, [])

  return (
    <>
    <PerspectiveCamera position={[0, 1, -5]} rotation={[0, Math.PI, 0]} makeDefault={active} />
    <group ref={gRef} position={position} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.kart.geometry} material={mat.current} />
      <mesh castShadow receiveShadow geometry={nodes.daria.geometry} material={mat.current} />
    </group>
    </>
  )
})

useGLTF.preload('/assets/player.glb')

export default PlayerMesh