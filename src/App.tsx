import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Perf } from 'r3f-perf';

import { config } from './config';
import * as constants from './constants';
import Sun from './components/Sun';
import Planet from './components/Planet';
import Stars from './components/Stars';
import Belt from './components/Belt';
import Moon from './components/Moon';
import Rings from './components/Rings';

import mercuryTexture from './textures/mercury-color-map.jpg';
import venusTexture from './textures/venus-color-map.jpg';
import earthTexture from './textures/earth-color-map.jpg';
import marsTexture from './textures/mars-color-map.jpg';
import jupiterTexture from './textures/jupiter-color-map.jpg';
import saturnTexture from './textures/saturn-color-map.jpg';
import uranusTexture from './textures/uranus-color-map.jpg';
import neptuneTexture from './textures/neptune-color-map.jpg';
import moonTexture from './textures/moon-color-map.jpg';
import saturnRingAlphaTexture from './textures/saturn-ring-alpha.png';

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
      <Perf position="top-left" />
      <OrbitControls
        minDistance={config.controlsMinDistance}
        maxDistance={config.controlsMaxDistance}
        maxPolarAngle={Math.PI / 2}
      />

      <ambientLight color="rgb(0 2 39)" intensity={0.1} />
      <color attach="background" args={['rgb(0, 2, 27)']} />

      <Sun />

      <Suspense>
        <Planet cfg={constants.MERCURY} map={mercuryTexture} />
        <Planet cfg={constants.VENUS} map={venusTexture} />

        <Planet cfg={constants.EARTH} map={earthTexture}>
          <Moon cfg={constants.MOON} map={moonTexture} />
        </Planet>

        <Planet cfg={constants.MARS} map={marsTexture}>
          <Moon cfg={constants.PHOBOS} />
          <Moon cfg={constants.DEIMOS} />
        </Planet>

        <Planet cfg={constants.JUPITER} map={jupiterTexture} />

        <Planet cfg={constants.SATURN} map={saturnTexture}>
          <Rings cfg={constants.SATURN_RING} alphaMap={saturnRingAlphaTexture} />
        </Planet>

        <Planet cfg={constants.URANUS} map={uranusTexture} />
        <Planet cfg={constants.NEPTUNE} map={neptuneTexture} />
      </Suspense>

      <Stars />
      <Belt />
    </Canvas>
  );
}
