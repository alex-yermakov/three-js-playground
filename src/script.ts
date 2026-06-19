import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const SUN_RADIUS = 696_000;
const EARTH_RADIUS = 6_371;
const SUN_EARTH_D = 150_000_000;

const SIZE_SCALE_FACTOR = 0.3;
const DISTANCE_SCALE_FACTOR = 0.4;

const gui = new GUI();

const scene = new THREE.Scene();

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1, 128, 128),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);

const earthR = (EARTH_RADIUS / SUN_RADIUS) ** SIZE_SCALE_FACTOR;
const earthD = (SUN_EARTH_D / SUN_RADIUS) ** DISTANCE_SCALE_FACTOR;
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(earthR, 128, 128),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

scene.add(sun);
scene.add(earth);

earth.position.set(earthD, 0, 0);

const axesHelper = new THREE.AxesHelper(10);

scene.add(axesHelper);

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
controls.minDistance = 10;
controls.maxDistance = 50;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

renderer.setAnimationLoop(animate);

gui
  .add({ sizeScaleFactor: SIZE_SCALE_FACTOR }, 'sizeScaleFactor')
  .min(0)
  .max(0.75)
  .step(0.01)
  .onChange((value: number) => {
    const params = earth.geometry.parameters;
    const radius = (EARTH_RADIUS / SUN_RADIUS) ** value;

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
  setEarthPosition(clock * 0.001);

  controls.update();
  renderer.render(scene, camera);
}

function setEarthPosition(theta: number) {
  const e = 0.0167;
  const r = (earthD * (1 - e ** 2)) / (1 + e * Math.cos(theta));
  const x = r * Math.sin(theta);
  const z = r * Math.cos(theta);

  earth.position.set(x, 0, z);
}
