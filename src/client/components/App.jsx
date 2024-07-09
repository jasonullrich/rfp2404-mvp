import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'

import RTC from './RTC'
import Hall from './Hall'

import { ColorManagement } from 'three'
ColorManagement.enabled = true

const App = () => {

  return (
    <>
    <RTC>
      <main className='w-full aspect-video'>
        <Canvas camera={{position: [0, 3, 3]}}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[1, 1, 1]} />
          <Hall />
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color={'green'} />
          </mesh>
        </Canvas>
      </main>
    </RTC>
    </>
  )
}

export default App