import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Perf } from 'r3f-perf';

import { config } from './config';
import Sun from './components/Sun';
import Planet from './components/Planet';
import * as constants from './constants';

import mercuryTexture from './textures/mercury-color-map.jpg';
import venusTexture from './textures/venus-color-map.jpg';
import earthTexture from './textures/earth-color-map.jpg';
import marsTexture from './textures/mars-color-map.jpg';
import jupiterTexture from './textures/jupiter-color-map.jpg';
import saturnTexture from './textures/saturn-color-map.jpg';
import uranusTexture from './textures/uranus-color-map.jpg';
import neptuneTexture from './textures/neptune-color-map.jpg';

const textures = {
  MERCURY: mercuryTexture,
  VENUS: venusTexture,
  EARTH: earthTexture,
  MARS: marsTexture,
  JUPITER: jupiterTexture,
  SATURN: saturnTexture,
  URANUS: uranusTexture,
  NEPTUNE: neptuneTexture,
};

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
      <Perf />
      <OrbitControls minDistance={config.controlsMinDistance} maxDistance={config.controlsMaxDistance} />

      <ambientLight color="rgb(0 2 39)" intensity={0.1} />
      <color attach="background" args={['rgb(0, 2, 27)']} />

      <Sun />

      <Planet cfg={constants.MERCURY} map={textures[constants.MERCURY.key]} />
      <Planet cfg={constants.VENUS} map={textures[constants.VENUS.key]} />
      <Planet cfg={constants.EARTH} map={textures[constants.EARTH.key]} />
      <Planet cfg={constants.MARS} map={textures[constants.MARS.key]} />
      <Planet cfg={constants.JUPITER} map={textures[constants.JUPITER.key]} />
      <Planet cfg={constants.SATURN} map={textures[constants.SATURN.key]} />
      <Planet cfg={constants.URANUS} map={textures[constants.URANUS.key]} />
      <Planet cfg={constants.NEPTUNE} map={textures[constants.NEPTUNE.key]} />
    </Canvas>
  );
}
