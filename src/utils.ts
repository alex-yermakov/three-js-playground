import * as THREE from 'three';

import { config } from './config';
import { SUN_RADIUS } from './constants';

export const pixelRatio = Math.min(window.devicePixelRatio, 2);

export const textureLoaderManager = new THREE.LoadingManager();
export const textureLoader = new THREE.TextureLoader(textureLoaderManager);

textureLoaderManager.onError = (url) => {
  console.error(`Failed to load texture: ${url}`);
};

export const scaleSize = (size: number) => {
  return (size / SUN_RADIUS) ** (1 - config.sizeScaleFactor);
};

export const scaleDistance = (distance: number) => {
  return (distance / SUN_RADIUS) ** (1 - config.distanceScaleFactor);
};

export const calculateOrbitalProgress = (time: number) => {
  return time * config.orbitalSpeed;
};

export const calculateRotationProgress = (time: number) => {
  return time * config.rotationSpeed;
};

// AI
// Remap UVs so the rectangular strip texture wraps radially:
// U follows the radius (inner -> outer), V follows the angle around the ring.
export const remapRingUVs = (geometry: THREE.RingGeometry, innerRadius: number, outerRadius: number) => {
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const v3 = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const radius = v3.length();
    const u = (radius - innerRadius) / (outerRadius - innerRadius);
    const v = (Math.atan2(v3.y, v3.x) + Math.PI) / (Math.PI * 2);
    uv.setXY(i, u, v);
  }

  uv.needsUpdate = true;
};

export const applySizes = (shader: string) => {
  return `attribute float aSize;\n${shader}`.replace('gl_PointSize = size', 'gl_PointSize = aSize');
};
