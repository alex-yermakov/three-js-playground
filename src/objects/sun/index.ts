import * as THREE from 'three';

import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import { calculateRotationProgress } from '../../utils';

export const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1, 256, 256),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
    },
  })
);

const sunLight = new THREE.PointLight(0xffffff, 25, 80, 0.25);

sunLight.shadow.mapSize.set(512, 512);
sunLight.shadow.camera.near = 5;
sunLight.shadow.camera.far = 60;

sunLight.castShadow = true;
sunLight.position.copy(sun.position);
sun.add(sunLight);

export const sunTick = (time: number) => {
  sun.material.uniforms.time.value = time / 1000;
  sun.rotation.y = calculateRotationProgress(time) / 2;
};
