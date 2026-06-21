import * as THREE from 'three';

import moonTexture from '../textures/moon-color-map.jpg';
import { Celestial, TCelestialConfig } from './celestial';
import { Planet, planetsArray } from './planets';
import { EARTH_MOONS, MARS_MOONS } from '../constants';

class Moon extends Celestial {
  constructor(
    private readonly planet: Planet,
    cfg: TCelestialConfig,
    map?: THREE.Texture
  ) {
    super(cfg, map);

    this._position = this.getPosition(0);
    this.mesh.position.copy(this._position);
  }

  getPosition(theta: number) {
    const relativePosition = super.getPosition(theta);
    const planetPosition = this.planet?.position ?? new THREE.Vector3();

    return relativePosition.clone().add(planetPosition);
  }
}

const textureLoader = new THREE.TextureLoader();
const group = new THREE.Group();

const earth = planetsArray.find((planet) => planet.key === 'EARTH');
const mars = planetsArray.find((planet) => planet.key === 'MARS');

const moons = [
  ...EARTH_MOONS.map((moon) => new Moon(earth, moon, textureLoader.load(moonTexture))),
  ...MARS_MOONS.map((moon) => new Moon(mars, moon)),
];

export { group as moons };

export const moonsTick = (time: number) => {
  moons.forEach((moon) => {
    moon.tick(time);
  });
};

moons.forEach((moon) => {
  group.add(moon.mesh);
});
