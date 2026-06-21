export const config = {
  showOrbit: true,
  showMoons: true,
  showAsteroidBelt: true,

  sizeScaleFactor: 0.6, // render size = (size / sun radius) ^ (1 - sizeScaleFactor)
  distanceScaleFactor: 0.55, // render distance = (distance / sun radius) ^ (1 - distanceScaleFactor)

  orbitalSpeed: 1 / 60, // 1 earth year = 60 seconds
  rotationSpeed: 1 / 5, // 1 earth day = 5 seconds

  orbitResolution: 1000,
  orbitOpacity: 0.3,

  cameraDistance: 60,
  cameraPitch: Math.PI / 3,
};
