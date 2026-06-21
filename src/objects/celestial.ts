import * as THREE from 'three';
import { calculateOrbitalProgress, calculateRotationProgress, scaleDistance, scaleSize } from '../utils';

export type TCelestialConfig = {
  key: string;
  radius: number;
  semiMajorAxis: number;
  eccentricity: number;
  orbitPeriod: number;
  orbitAngle: number;
  dayLength: number;
  axialTilt: number;
  orbitColor?: number;
};

export abstract class Celestial {
  readonly geometry: THREE.SphereGeometry;
  readonly material: THREE.MeshStandardMaterial;
  readonly mesh: THREE.Mesh;

  protected _position: THREE.Vector3;

  protected readonly scaledRadius: number;
  protected readonly semiMajorAxis: number;

  constructor(
    protected readonly cfg: TCelestialConfig,
    map?: THREE.Texture
  ) {
    if (map) {
      map.colorSpace = THREE.SRGBColorSpace;
    }

    this.scaledRadius = scaleSize(this.cfg.radius);
    this.semiMajorAxis = scaleDistance(this.cfg.semiMajorAxis);

    this.geometry = new THREE.SphereGeometry(this.scaledRadius, 256, 128);
    this.material = new THREE.MeshStandardMaterial({ map: map ?? null });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this._position = this.getPosition(0);
    this.mesh.rotation.z = this.cfg.axialTilt;
  }

  tick(time: number) {
    const orbitalProgress = calculateOrbitalProgress(time);
    const rotationProgress = calculateRotationProgress(time);

    const orbitalAngle = (orbitalProgress * Math.PI * 2) / this.cfg.orbitPeriod;
    const rotationAngle = (rotationProgress * Math.PI * 2) / this.cfg.dayLength;

    this._position = this.getPosition(orbitalAngle);

    this.mesh.position.copy(this._position);
    this.mesh.rotation.y = rotationAngle;
  }

  getPosition(theta: number) {
    const alpha = this.cfg.orbitAngle * Math.cos(theta); // orbit's skew -> current Y displacement angle
    const r = (this.semiMajorAxis * (1 - this.cfg.eccentricity ** 2)) / (1 + this.cfg.eccentricity * Math.cos(theta));

    const x = r * Math.cos(theta) * Math.cos(alpha);
    const z = -r * Math.sin(theta) * Math.cos(alpha);
    const y = r * Math.sin(alpha);

    return new THREE.Vector3(x, y, z);
  }

  get key() {
    return this.cfg.key;
  }

  get position() {
    return this._position;
  }
}
