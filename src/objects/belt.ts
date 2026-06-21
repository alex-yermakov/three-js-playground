import * as THREE from 'three';

import { BELT_CLOSEST_DISTANCE, BELT_FARTHEST_DISTANCE, BELT_YEAR } from '../constants';
import { calculateOrbitalProgress, scaleDistance, scaleSize } from '../utils';

const beltClosestDistance = scaleDistance(BELT_CLOSEST_DISTANCE);
const beltFarthestDistance = scaleDistance(BELT_FARTHEST_DISTANCE);
const beltWidth = beltFarthestDistance - beltClosestDistance;

const minSize = scaleSize(1);
const maxSize = scaleSize(10);

const group = new THREE.Group();

const material = new THREE.MeshLambertMaterial({ color: 0x808080 });

for (let i = 0; i < 1000; i++) {
  const size = minSize + Math.random() * (maxSize - minSize);
  const geometry = new THREE.SphereGeometry(size);
  const mesh = new THREE.Mesh(geometry, material);

  const theta = Math.random() * Math.PI * 2;
  const r = Math.random() * beltWidth + beltClosestDistance;
  const x = r * Math.cos(theta);
  const z = -r * Math.sin(theta);
  const y = Math.random() * 0.1 + 0.05;

  mesh.position.set(x, y, z);
  group.add(mesh);
}

export { group as belt };

export const beltTick = (time: number) => {
  group.rotation.y = (2 * Math.PI * calculateOrbitalProgress(time)) / BELT_YEAR;
};
