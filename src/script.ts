import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import sunTexture from './textures/sun-color-map.jpg';
import cosmos from './textures/cosmos.jpg';
import { planets, planetsTick } from './objects/planets';
import { orbits } from './objects/orbits';
import { moons, moonsTick } from './objects/moons';
import { belt, beltTick } from './objects/belt';
import { satellite, satelliteTick } from './objects/satellite';
import { config } from './config';
import { textureLoader } from './utils';

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight('rgb(0 2 39)', 0.1);

// ===== SUN =====

const sunTextureMap = textureLoader.load(sunTexture, () => {
  sunTextureMap.colorSpace = THREE.SRGBColorSpace;
});

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1, 128, 128),
  new THREE.MeshBasicMaterial({
    map: sunTextureMap,
  })
);

const sunLight = new THREE.PointLight(0xffffff, 25, 80, 0.25);

sunLight.castShadow = true;
sunLight.position.copy(sun.position);
sun.add(sunLight);

// ====== SCENE ======

scene.add(ambientLight);
scene.add(sun);

scene.add(planets);
scene.add(orbits);
scene.add(moons);
scene.add(belt);
scene.add(satellite);

scene.background = new THREE.Color('rgb(0, 2, 27)');

textureLoader.load(cosmos, (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
});

// ===== CAMERA, RENDERER, CONTROLS =====

const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.001, 210);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl')!,
});

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.setFromSphericalCoords(config.cameraDistance, config.cameraPitch, 0);
camera.lookAt(sun.position);

controls.enablePan = true;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 2;
controls.maxDistance = 150;

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

renderer.setAnimationLoop(animate);

// ===== EVENT LISTENERS =====

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let lastTime = 0;
let lastUpdated = 0;
const fpsMonitor = document.querySelector('.fps')!;

function animate(time: number) {
  planetsTick(time);
  moonsTick(time);
  beltTick(time);
  satelliteTick(time);

  controls.update();
  renderer.render(scene, camera);

  const fps = 1000 / (time - lastTime);

  lastTime = time;

  if (time - lastUpdated > 1000) {
    fpsMonitor.textContent = `FPS: ${fps.toFixed(2)}`;
    lastUpdated = time;
  }
}
