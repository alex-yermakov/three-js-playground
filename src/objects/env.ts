import * as THREE from 'three';
import { applySizes, textureLoader } from '../utils';
import { config } from '../config';

import starAlphaTexture from '../textures/circle-alpha-map.png';

const count = 10000;

const reddish = new THREE.Color(0xffb3a7);
const bluish = new THREE.Color(0xa9c7ff);

const points = Array.from({ length: count }, () => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.PI * (1 - Math.sin(Math.random() * Math.PI) ** 0.75);
  const r = config.starMaxDistance - config.starSpread * Math.random();

  return new THREE.Vector3().setFromSphericalCoords(r, phi, theta);
});

const sizes = Array.from({ length: count }, () => {
  return 0.5 + Math.random() * 1;
});

const colors = Array.from({ length: count }, () => {
  const blueFactor = Math.random();
  const redFactor = Math.random() ** 2;

  return new THREE.Color('white').lerp(reddish, redFactor).lerp(bluish, blueFactor).toArray();
}).flat();

export const stars = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(points),
  new THREE.PointsMaterial({
    color: 0xffffff,
    vertexColors: true,
    transparent: true,
    alphaMap: textureLoader.load(starAlphaTexture),
    sizeAttenuation: true,
  })
);

stars.geometry.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(sizes), 1));
stars.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

stars.material.onBeforeCompile = (shader) => {
  shader.vertexShader = applySizes(shader.vertexShader);
};
