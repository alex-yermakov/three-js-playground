import * as THREE from 'three';

import mercuryTexture from '../textures/mercury-color-map.jpg';
import venusTexture from '../textures/venus-color-map.jpg';
import earthTexture from '../textures/earth-color-map.jpg';
import marsTexture from '../textures/mars-color-map.jpg';
import jupiterTexture from '../textures/jupiter-color-map.jpg';
import saturnTexture from '../textures/saturn-color-map.jpg';
import uranusTexture from '../textures/uranus-color-map.jpg';
import neptuneTexture from '../textures/neptune-color-map.jpg';
import earthHeightTexture from '../textures/earth-height-map.jpg';
import { PLANETS } from '../constants';
import { Celestial, TCelestialConfig } from './celestial';

export class Planet extends Celestial {
  constructor(
    cfg: TCelestialConfig,
    map: THREE.Texture,
    readonly orbitColor: number
  ) {
    super(cfg, map);
  }
}

const textureLoader = new THREE.TextureLoader();
const group = new THREE.Group();

const textures = {
  MERCURY: mercuryTexture,
  VENUS: venusTexture,
  EARTH: earthTexture,
  MARS: marsTexture,
  JUPITER: jupiterTexture,
  SATURN: saturnTexture,
  URANUS: uranusTexture,
  NEPTUNE: neptuneTexture,
};

const planets = PLANETS.map((cfg) => {
  return new Planet(cfg, textureLoader.load(textures[cfg.key]), cfg.orbitColor);
});

export const planetsTick = (time: number) => {
  planets.forEach((planet) => {
    planet.tick(time);
  });
};

export { group as planets, planets as planetsArray };

planets[2].material.displacementMap = textureLoader.load(earthHeightTexture);
planets[2].material.displacementScale = 0.01;

planets.forEach((planet) => {
  group.add(planet.mesh);
});
