import { useRef } from 'react';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import satelliteModel from '../models/satellite.glb';
import { config } from '../config';

const initialPosition = new Vector3().setFromSphericalCoords(
  config.cameraDistance - 0.05,
  config.cameraPitch - 0.0001,
  -0.0005
);

export default function Satellite() {
  const model = useGLTF(satelliteModel);
  const ref = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    if (ref.current == null) {
      return;
    }

    const time = clock.getElapsedTime();
    const angle = (2 * Math.PI * time) / 20; // 20 seconds per rotation

    const rotX = angle * 2 + Math.PI / 2;
    const rotY = (Math.cos(angle) * Math.PI) / 8;
    const rotZ = (Math.sin(angle) * Math.PI) / 8 + Math.PI / 2;

    ref.current.rotation.set(rotX, rotY, rotZ, 'ZYX');
    ref.current.position.x += 5 * 10e-4 * delta;
  });

  return <primitive ref={ref} object={model.scene} scale={0.001} position={initialPosition} />;
}
