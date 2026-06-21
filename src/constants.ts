export const SUN_RADIUS = 696_000;

export const BELT_CLOSEST_DISTANCE = 329_466_000;
export const BELT_FARTHEST_DISTANCE = 479_466_000;
export const BELT_YEAR = 4.6; // in earth years

export const EARTH_MOONS = [
  {
    key: 'MOON',
    radius: 1_737.4,
    distance: 384_400,
    orbitPeriod: 0.0748, // in earth years
    dayLength: 27.321661, // in earth days
  },
];

export const MARS_MOONS = [
  {
    key: 'PHOBOS',
    radius: 13.2,
    distance: 9_376,
    orbitPeriod: 0.3189102, // in earth years
    dayLength: 0.3229, // in earth days
  },
  {
    key: 'DEIMOS',
    radius: 6.2,
    distance: 23_460,
    orbitPeriod: 1.26244, // in earth years
    dayLength: 1.26244, // in earth days
  },
];

export const PLANETS = [
  {
    key: 'MERCURY',
    radius: 2_439.7,
    farthestDistance: 46_001_000,
    closestDistance: 45_925_000,
    eccentricity: 0.20563069,
    orbitAngle: 0.2408467, // in radians
    orbitPeriod: 0.2408467, // in earth years
    dayLength: 175.938667, // in earth days
  },
  {
    key: 'VENUS',
    radius: 6_051.8,
    farthestDistance: 108_209_000,
    closestDistance: 107_477_000,
    eccentricity: 0.00677323,
    orbitAngle: 0.0592, // in radians
    orbitPeriod: 0.61519726, // in earth years
    dayLength: 224.70069, // in earth days
  },
  {
    key: 'EARTH',
    radius: 6_371,
    farthestDistance: 152_100_000,
    closestDistance: 147_100_000,
    eccentricity: 0.01671022,
    orbitAngle: 0.0000104, // in radians
    orbitPeriod: 1, // in earth years
    dayLength: 1, // in earth days
    moons: EARTH_MOONS,
  },
  {
    key: 'MARS',
    radius: 3_390,
    farthestDistance: 249_200_000,
    closestDistance: 206_700_000,
    eccentricity: 0.09341233,
    orbitAngle: 0.0349066, // in radians
    orbitPeriod: 1.8808158, // in earth years
    dayLength: 1.02595675, // in earth days
    moons: MARS_MOONS,
  },
  {
    key: 'JUPITER',
    radius: 69_911,
    farthestDistance: 816_520_000,
    closestDistance: 740_550_000,
    eccentricity: 0.04839266,
    orbitAngle: 0.0172028, // in radians
    orbitPeriod: 11.862615, // in earth years
    dayLength: 0.41353, // in earth days
  },
  {
    key: 'SATURN',
    radius: 58_232,
    farthestDistance: 1_514_500_000,
    closestDistance: 1_352_550_000,
    eccentricity: 0.0541506,
    orbitAngle: 0.0093132, // in radians
    orbitPeriod: 29.447498, // in earth years
    dayLength: 10.6585, // in earth days
  },
  {
    key: 'URANUS',
    radius: 25_362,
    farthestDistance: 3_003_600_000,
    closestDistance: 2_748_900_000,
    eccentricity: 0.04716771,
    orbitAngle: 0.007699, // in radians
    orbitPeriod: 84.016846, // in earth years
    dayLength: 17.239242, // in earth days
  },
  {
    key: 'NEPTUNE',
    radius: 24_622,
    farthestDistance: 4_545_300_000,
    closestDistance: 4_452_900_000,
    eccentricity: 0.00858587,
    orbitAngle: 0.0039828, // in radians
    orbitPeriod: 164.79132, // in earth years
    dayLength: 164.79132, // in earth days
  },
];
