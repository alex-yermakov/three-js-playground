import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';

import { planets, planetsTick } from './objects/planets';
import { orbits } from './objects/orbits';
import { moons, moonsTick } from './objects/moons';
import { belt, beltTick } from './objects/belt';
import { satellite, satelliteTick } from './objects/satellite';
import { config } from './config';
import { stars } from './objects/env';
import { sun, sunTick } from './objects/sun';
import { pixelRatio } from './utils';

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight('rgb(0 2 39)', 0.1);

// ====== SCENE ======

scene.add(ambientLight);
scene.add(sun);

scene.add(planets);
scene.add(orbits);
scene.add(moons);
scene.add(belt);
scene.add(satellite);
scene.add(stars);

scene.background = new THREE.Color('rgb(0, 2, 27)');

// ===== CAMERA, RENDERER, CONTROLS =====

const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.001, config.controlsMaxDistance + config.starMaxDistance);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl')!,
});

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.setFromSphericalCoords(config.cameraDistance, config.cameraPitch, 0);
camera.lookAt(sun.position);

controls.enablePan = true;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = config.controlsMinDistance;
controls.maxDistance = config.controlsMaxDistance;

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(pixelRatio);
renderer.render(scene, camera);

renderer.setAnimationLoop(animate);

// ===== GUI =====
const gui = new GUI();

gui.add({ limitPolarAngle: true }, 'limitPolarAngle').onChange((value) => {
  controls.maxPolarAngle = value ? Math.PI / 2 : Math.PI;
});

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
  sunTick(time);

  controls.update();
  renderer.render(scene, camera);

  const fps = 1000 / (time - lastTime);

  lastTime = time;

  if (time - lastUpdated > 1000) {
    fpsMonitor.textContent = `FPS: ${fps.toFixed(2)}`;
    lastUpdated = time;
  }
}
