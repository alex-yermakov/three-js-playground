import * as THREE from 'three';

import { BELT_CLOSEST_DISTANCE, BELT_FARTHEST_DISTANCE, BELT_YEAR } from '../constants';
import { applySizes, calculateOrbitalProgress, pixelRatio, scaleDistance, textureLoader } from '../utils';

import asteroidAlphaTexture from '../textures/circle-alpha-map.png';

const beltClosestDistance = scaleDistance(BELT_CLOSEST_DISTANCE);
const beltFarthestDistance = scaleDistance(BELT_FARTHEST_DISTANCE);
const beltWidth = beltFarthestDistance - beltClosestDistance;

const minSize = 0.005;
const maxSize = 0.3;

const count = 10000;

const points = Array.from({ length: count }, () => {
  const theta = Math.random() * Math.PI * 2;

  const rDisplacement = Math.random() - 0.5;
  const r = beltClosestDistance + ((1 + (2 * rDisplacement) ** 2 * Math.sign(rDisplacement)) * beltWidth) / 2;

  const x = r * Math.cos(theta);
  const z = -r * Math.sin(theta);
  const y = (Math.random() - 0.5) * 0.5;

  return [x, y, z];
}).flat();

const sizes = Array.from({ length: count }, () => {
  return (minSize + Math.random() * (maxSize - minSize)) * pixelRatio;
});

const asteroids = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({
    color: 0x505050,
    transparent: true,
    alphaMap: textureLoader.load(asteroidAlphaTexture),
    sizeAttenuation: true,
    depthWrite: false,
  })
);

asteroids.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
asteroids.geometry.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(sizes), 1));

asteroids.material.onBeforeCompile = (shader) => {
  shader.vertexShader = applySizes(shader.vertexShader);
};

export { asteroids as belt };

export const beltTick = (time: number) => {
  asteroids.rotation.y = (2 * Math.PI * calculateOrbitalProgress(time)) / BELT_YEAR;
};
