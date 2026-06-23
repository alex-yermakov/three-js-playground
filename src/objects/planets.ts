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
import saturnRingAlphaTexture from '../textures/saturn-ring-alpha.png';
import { PLANETS, SATURN_RING } from '../constants';
import { Celestial, TCelestialConfig } from './celestial';
import { remapRingUVs, textureLoader } from '../utils';

export class Planet extends Celestial {
  private ring?: THREE.Mesh;

  constructor(
    cfg: TCelestialConfig,
    map: THREE.Texture,
    readonly orbitColor: number
  ) {
    super(cfg, map);
  }

  addRing(closest: number, farthest: number, angle: number, alphaMap: THREE.Texture) {
    const innerRadius = this.scaledRadius * (closest / this.cfg.radius);
    const outerRadius = this.scaledRadius * (farthest / this.cfg.radius);

    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);

    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
      transparent: true,
      alphaMap,
    });

    remapRingUVs(geometry, innerRadius, outerRadius);

    this.ring = new THREE.Mesh(geometry, material);

    this.ring.position.copy(this.position);
    this.ring.rotation.x = Math.PI / 2;
    this.ring.rotation.z = angle;

    this.ring.rotation.y = angle;

    return this.ring;
  }

  tick(time: number) {
    super.tick(time);

    this.ring?.position.copy(this.position);
  }
}

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

group.add(
  planets[5].addRing(
    SATURN_RING.closestDistance,
    SATURN_RING.farthestDistance,
    SATURN_RING.angle,
    textureLoader.load(saturnRingAlphaTexture)
  )
);
