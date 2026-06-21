import * as THREE from 'three';
import { SUN_RADIUS } from './constants';

type TMoon = {
  mesh: THREE.Mesh;
  distance: number;
  orbitPeriod: number;
  dayLength: number;
};

export class Planet {
  static sizeScaleFactor = 0.4;
  static distanceScaleFactor = 0.45;

  static secondsPerYear = 60;
  static secondsPerDay = 5;

  readonly group: THREE.Group;

  readonly geometry: THREE.SphereGeometry;
  readonly material: THREE.MeshStandardMaterial;
  readonly mesh: THREE.Mesh;

  readonly moons: TMoon[] = [];

  constructor(
    readonly key: string,
    private readonly radius: number,
    private readonly farthestDistance: number,
    private readonly closestDistance: number,
    private readonly eccentricity: number,
    private readonly orbitPeriod: number,
    private readonly orbitAngle: number,
    private readonly dayLength: number,
    map: THREE.Texture
  ) {
    const scaledRadius = this.scaleSize(this.radius);

    map.colorSpace = THREE.SRGBColorSpace;

    this.group = new THREE.Group();

    this.geometry = new THREE.SphereGeometry(scaledRadius, 256, 128);
    this.material = new THREE.MeshStandardMaterial({ map });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.group.add(this.mesh);

    this.update(0);
  }

  addMoon(radius: number, distance: number, orbitPeriod: number, dayLength: number, map?: THREE.Texture) {
    const scaledRadius = this.scaleSize(radius);

    const geometry = new THREE.SphereGeometry(scaledRadius, 128, 64);
    const material = new THREE.MeshStandardMaterial({ map: map ?? null });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.group.add(mesh);
    this.moons.push({
      mesh,
      distance,
      orbitPeriod,
      dayLength,
    });
  }

  addOrbit() {
    const res = 1000;
    const points = Array.from({ length: res }, (_, i) => this.getPosition((i * Math.PI * 2) / res));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const mesh = new THREE.Line(geometry, material);

    this.group.add(mesh);
  }

  register(scene: THREE.Scene) {
    scene.add(this.group);
  }

  update(time: number) {
    const seconds = time / 1000;

    const earthYears = seconds / Planet.secondsPerYear;
    const orbitAngle = (earthYears * Math.PI * 2) / this.orbitPeriod;
    const orbitPosition = this.getPosition(orbitAngle);

    const earthDays = seconds / Planet.secondsPerDay;
    const rotationAngle = (earthDays * Math.PI * 2) / this.dayLength;

    this.moons.forEach((moon) => {
      const moonOrbitAngle = (earthYears * Math.PI * 2) / moon.orbitPeriod;
      const relativePosition = this.getMoonPosition(moonOrbitAngle, moon.distance);
      const absolutePosition = orbitPosition.clone().add(relativePosition);

      const rotationAngle = (earthDays * Math.PI * 2) / moon.dayLength;

      moon.mesh.position.copy(absolutePosition);
      moon.mesh.rotation.y = rotationAngle;
    });

    this.mesh.position.copy(orbitPosition);
    this.mesh.rotation.y = rotationAngle;
  }

  private getPosition(theta: number) {
    const e = this.eccentricity; // eccentricity coefficient;
    const a = this.scaleDistance((this.farthestDistance + this.closestDistance) / 2); // semi-major axis;

    const alpha = this.orbitAngle * Math.cos(theta) * 0;
    const r = (a * (1 - e ** 2)) / (1 - e * Math.cos(theta));
    const x = r * Math.cos(theta) * Math.cos(alpha);
    const z = -r * Math.sin(theta) * Math.cos(alpha);
    const y = r * Math.sin(alpha);

    return new THREE.Vector3(x, y, z);
  }

  private getMoonPosition(theta: number, distance: number) {
    const r = this.scaleDistance(distance);
    const x = r * Math.cos(theta);
    const z = -r * Math.sin(theta);
    const y = 0;

    return new THREE.Vector3(x, y, z);
  }

  private scaleSize(size: number) {
    return (size / SUN_RADIUS) ** Planet.sizeScaleFactor;
  }

  private scaleDistance(distance: number) {
    return (distance / SUN_RADIUS) ** Planet.distanceScaleFactor;
  }
}
