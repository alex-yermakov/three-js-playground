import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

import sunTexture from './textures/sun-color-map.jpg';
import earthTexture from './textures/earth-color-map.jpg';
import earthHeightTexture from './textures/earth-height-map.jpg';

const SUN_RADIUS = 696_000;
const EARTH_RADIUS = 6_371;
const EARTH_DISPLACEMENT_RATIO = 0.025;
const SUN_EARTH_D = 150_000_000;

const config = {
  animating: false,
  sizeScaleFactor: 0.3,
  distanceScaleFactor: 0.4,
};

const gui = new GUI();
const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(10);
const ambientLight = new THREE.AmbientLight('rgb(0 2 39)', 0.03);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1, 128, 128),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture),
  })
);

const sunLight = new THREE.PointLight(0xffffff, 100, 0, 1.5);

sunLight.position.copy(sun.position);
sun.add(sunLight);

const earthR = (EARTH_RADIUS / SUN_RADIUS) ** config.sizeScaleFactor;
const earthD = (SUN_EARTH_D / SUN_RADIUS) ** config.distanceScaleFactor;
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(earthR, 256, 128),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(earthTexture),
    displacementMap: textureLoader.load(earthHeightTexture),
    displacementScale: EARTH_DISPLACEMENT_RATIO * earthR,
  })
);

earth.position.set(earthD, 0, 0);

scene.add(sun);
scene.add(earth);
scene.add(ambientLight);
scene.add(axesHelper);

scene.background = new THREE.Color('rgb(0, 2, 27)');

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl')!,
});

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.setFromSphericalCoords(25, Math.PI / 3, 0);
camera.lookAt(sun.position);

controls.enablePan = false;
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 50;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

renderer.setAnimationLoop(animate);

gui.add(config, 'animating');
gui
  .add(config, 'sizeScaleFactor')
  .min(0)
  .max(0.75)
  .step(0.01)
  .onChange((value: number) => {
    const params = earth.geometry.parameters;
    const radius = (EARTH_RADIUS / SUN_RADIUS) ** value;

    earth.material.displacementScale = EARTH_DISPLACEMENT_RATIO * radius;

    earth.geometry.dispose();
    earth.geometry = new THREE.SphereGeometry(
      radius,
      params.widthSegments,
      params.heightSegments
    );
  });

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate(clock: number) {
  if (config.animating) {
    setEarthPosition(clock * 0.00025);
  }

  controls.update();
  renderer.render(scene, camera);
}

function setEarthPosition(theta: number) {
  const e = 0.0167;
  const r = (earthD * (1 - e ** 2)) / (1 + e * Math.cos(theta));
  const x = r * Math.cos(theta);
  const z = -r * Math.sin(theta);

  earth.position.set(x, 0, z);
}
