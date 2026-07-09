import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Perf } from 'r3f-perf';

import { config } from './config';
import Sun from './components/Sun';
import Planet from './components/Planet';
import Stars from './components/Stars';
import Belt from './components/Belt';
import * as constants from './constants';

import mercuryTexture from './textures/mercury-color-map.jpg';
import venusTexture from './textures/venus-color-map.jpg';
import earthTexture from './textures/earth-color-map.jpg';
import marsTexture from './textures/mars-color-map.jpg';
import jupiterTexture from './textures/jupiter-color-map.jpg';
import saturnTexture from './textures/saturn-color-map.jpg';
import uranusTexture from './textures/uranus-color-map.jpg';
import neptuneTexture from './textures/neptune-color-map.jpg';

export function App() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.001,
        far: config.controlsMaxDistance + config.starMaxDistance,
        position: new Vector3().setFromSphericalCoords(config.cameraDistance, config.cameraPitch, 0),
      }}
      shadows
    >
      <Perf />
      <OrbitControls minDistance={config.controlsMinDistance} maxDistance={config.controlsMaxDistance} />

      <ambientLight color="rgb(0 2 39)" intensity={0.1} />
      <color attach="background" args={['rgb(0, 2, 27)']} />

      <Sun />

      <Planet cfg={constants.MERCURY} map={mercuryTexture} />
      <Planet cfg={constants.VENUS} map={venusTexture} />
      <Planet cfg={constants.EARTH} map={earthTexture} />
      <Planet cfg={constants.MARS} map={marsTexture} />
      <Planet cfg={constants.JUPITER} map={jupiterTexture} />
      <Planet cfg={constants.SATURN} map={saturnTexture} />
      <Planet cfg={constants.URANUS} map={uranusTexture} />
      <Planet cfg={constants.NEPTUNE} map={neptuneTexture} />

      <Stars />
      <Belt />
    </Canvas>
  );
}
