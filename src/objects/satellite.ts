import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import satelliteModel from '../models/satellite.glb';
import { config } from '../config';

const group = new THREE.Group();
const gltfLoader = new GLTFLoader();

let satellite: THREE.Object3D;

gltfLoader.load(satelliteModel, (gltf) => {
  const position = new THREE.Vector3().setFromSphericalCoords(
    config.cameraDistance - 0.05,
    config.cameraPitch - 0.0001,
    -0.0005
  );

  satellite = gltf.scene;
  satellite.position.copy(position);
  satellite.scale.setScalar(0.001);

  group.add(satellite);
});

export { group as satellite };

export const satelliteTick = (time: number) => {
  if (!satellite) {
    return;
  }

  const angle = (2 * Math.PI * time) / 1000 / 20; // 20 seconds per rotation

  const rotX = angle * 2 + Math.PI / 2;
  const rotY = (Math.cos(angle) * Math.PI) / 8;
  const rotZ = (Math.sin(angle) * Math.PI) / 8 + Math.PI / 2;

  satellite.rotation.set(rotX, rotY, rotZ, 'ZYX');
  satellite.position.x += 5 * 10e-6;
};
