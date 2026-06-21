import * as THREE from 'three';

import { config } from '../config';
import { planetsArray } from './planets';

const group = new THREE.Group();

const orbits = planetsArray.map((planet) => {
  const points = Array.from({ length: config.orbitResolution }, (_, i) =>
    planet.getPosition((i * Math.PI * 2) / config.orbitResolution)
  );

  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: planet.orbitColor,
      opacity: config.orbitOpacity,
      transparent: true,
    })
  );
});

export { group as orbits };

orbits.forEach((orbit) => {
  group.add(orbit);
});
