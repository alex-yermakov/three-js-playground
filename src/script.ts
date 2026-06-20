import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import sunTexture from './textures/sun-color-map.jpg';
import mercuryTexture from './textures/mercury-color-map.jpg';
import venusTexture from './textures/venus-color-map.jpg';
import earthTexture from './textures/earth-color-map.jpg';
import marsTexture from './textures/mars-color-map.jpg';
import jupiterTexture from './textures/jupiter-color-map.jpg';
import saturnTexture from './textures/saturn-color-map.jpg';
import uranusTexture from './textures/uranus-color-map.jpg';
import neptuneTexture from './textures/neptune-color-map.jpg';
import earthHeightTexture from './textures/earth-height-map.jpg';
import earthMoonTexture from './textures/moon-color-map.jpg';
import cosmos from './textures/cosmos.jpg';
import { Planet } from './planet';
import * as constants from './constants';

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight('rgb(0 2 39)', 0.03);
const textureLoader = new THREE.TextureLoader();

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

const sunLight = new THREE.PointLight(0xffffff, 300, 100, 1);

sunLight.castShadow = true;
sunLight.position.copy(sun.position);
sun.add(sunLight);

// ===== PLANETS =====

const textures = {
  MERCURY: textureLoader.load(mercuryTexture),
  VENUS: textureLoader.load(venusTexture),
  EARTH: textureLoader.load(earthTexture),
  MARS: textureLoader.load(marsTexture),
  JUPITER: textureLoader.load(jupiterTexture),
  SATURN: textureLoader.load(saturnTexture),
  URANUS: textureLoader.load(uranusTexture),
  NEPTUNE: textureLoader.load(neptuneTexture),

  EARTH_MOON: textureLoader.load(earthMoonTexture),
};

const planets = constants.PLANETS.map(({ key, moons }) => {
  const planet = new Planet(
    key,
    constants[`${key}_RADIUS`],
    constants[`${key}_FARTHEST_DISTANCE`],
    constants[`${key}_CLOSEST_DISTANCE`],
    constants[`${key}_ECCENTRICITY`],
    constants[`${key}_ORBIT_PERIOD`],
    constants[`${key}_ORBIT_ANGLE`],
    constants[`${key}_DAY_LENGTH`],
    textures[key]
  );

  moons?.forEach((moon) => {
    planet.addMoon(
      constants[`${moon}_RADIUS`],
      constants[`${moon}_DISTANCE`],
      constants[`${moon}_ORBIT_PERIOD`],
      constants[`${moon}_DAY_LENGTH`],
      textures[moon]
    );
  });

  return planet;
});

// Earth height map
planets[2].material.displacementMap = textureLoader.load(earthHeightTexture);
planets[2].material.displacementScale = 0.01;
planets[2].material.displacementBias = 0.01;

// ====== ASTEROID BELT =====

const { SUN_RADIUS, BELT_CLOSEST_DISTANCE, BELT_FARTHEST_DISTANCE, BELT_YEAR } = constants;

const beltClosestDistance = (BELT_CLOSEST_DISTANCE / SUN_RADIUS) ** Planet.distanceScaleFactor;
const beltFarthestDistance = (BELT_FARTHEST_DISTANCE / SUN_RADIUS) ** Planet.distanceScaleFactor;
const beltWidth = beltFarthestDistance - beltClosestDistance;

const belt = new THREE.Group();

const asteroidMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });

for (let i = 0; i < 1000; i++) {
  const size = Math.random() * 0.01 + 0.005;
  const geometry = new THREE.SphereGeometry(size);
  const mesh = new THREE.Mesh(geometry, asteroidMaterial);

  const theta = Math.random() * Math.PI * 2;
  const r = Math.random() * beltWidth + beltClosestDistance;
  const x = r * Math.cos(theta);
  const z = -r * Math.sin(theta);
  const y = Math.random() * 0.01 + 0.005;

  mesh.position.set(x, y, z);
  belt.add(mesh);
}

// ====== SCENE ======

scene.add(ambientLight);
scene.add(sun);
scene.add(belt);

planets.forEach((planet) => planet.register(scene));

scene.background = new THREE.Color('rgb(0, 2, 27)');

textureLoader.load(cosmos, (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = texture;
});

// ===== CAMERA, RENDERER, CONTROLS =====

const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspectRatio);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl')!,
});

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.setFromSphericalCoords(60, Math.PI / 2, 0);
camera.lookAt(sun.position);

controls.enablePan = true;
controls.enableDamping = true;
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

function animate(time: number) {
  planets.forEach((planet) => {
    planet.update(time);
  });

  belt.rotation.y = (2 * Math.PI * (time / 1000) * Planet.yearsPerSecond) / BELT_YEAR;

  controls.update();
  renderer.render(scene, camera);
}
