import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh, ShaderMaterial } from 'three';

import vertexShader from '../shaders/sun/vertex.glsl';
import fragmentShader from '../shaders/sun/fragment.glsl';
import { calculateRotationProgress } from '../utils';

export default function Sun() {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (material.current && mesh.current) {
      const time = clock.getElapsedTime();

      material.current.uniforms.uTime.value = time;
      mesh.current.rotation.y = calculateRotationProgress(time) / 2;
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 256, 128]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
      />

      <pointLight
        color="white"
        intensity={25}
        distance={80}
        decay={0.25}
        shadow-mapSize={[512, 512]}
        shadow-camera-near={5}
        shadow-camera-far={60}
        castShadow
      />
    </mesh>
  );
}
