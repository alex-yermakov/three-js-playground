import { config } from './config';
import { SUN_RADIUS } from './constants';

export const scaleSize = (size: number) => {
  return (size / SUN_RADIUS) ** (1 - config.sizeScaleFactor);
};

export const scaleDistance = (distance: number) => {
  return (distance / SUN_RADIUS) ** (1 - config.distanceScaleFactor);
};

export const calculateOrbitalProgress = (time: number) => {
  return (time / 1000) * config.orbitalSpeed;
};

export const calculateRotationProgress = (time: number) => {
  return (time / 1000) * config.rotationSpeed;
};
