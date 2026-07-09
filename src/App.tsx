import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Sun from './components/Sun';
import { config } from './config';
import { Vector3 } from 'three';

export function App() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.001,
        far: config.controlsMaxDistance + config.starMaxDistance,
        position: new Vector3().setFromSphericalCoords(config.cameraDistance, config.cameraPitch, 0),
      }}
    >
      <OrbitControls minDistance={config.controlsMinDistance} maxDistance={config.controlsMaxDistance} />

      <ambientLight color="rgb(0 2 39)" intensity={0.1} />
      <color attach="background" args={['rgb(0, 2, 27)']} />

      <Sun />
    </Canvas>
  );
}
