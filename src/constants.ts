export const SUN_RADIUS = 696_000;

export const MERCURY_RADIUS = 2_439.7;
export const MERCURY_FARTHEST_DISTANCE = 46_001_000;
export const MERCURY_CLOSEST_DISTANCE = 45_925_000;
export const MERCURY_ECCENTRICITY = 0.20563069;
export const MERCURY_ORBIT_ANGLE = 0.2408467;
export const MERCURY_ORBIT_PERIOD = 0.2408467; // in earth years
export const MERCURY_DAY_LENGTH = 175.938667; // in earth days

export const VENUS_RADIUS = 6_051.8;
export const VENUS_FARTHEST_DISTANCE = 108_209_000;
export const VENUS_CLOSEST_DISTANCE = 107_477_000;
export const VENUS_ECCENTRICITY = 0.00677323;
export const VENUS_ORBIT_ANGLE = 0.0592; // in radians
export const VENUS_ORBIT_PERIOD = 0.61519726; // in earth years
export const VENUS_DAY_LENGTH = 224.70069; // in earth days

export const EARTH_RADIUS = 6_371;
export const EARTH_FARTHEST_DISTANCE = 152_100_000;
export const EARTH_CLOSEST_DISTANCE = 147_100_000;
export const EARTH_ECCENTRICITY = 0.01671022;
export const EARTH_ORBIT_ANGLE = 0.0000104; // in radians
export const EARTH_ORBIT_PERIOD = 1; // in earth years
export const EARTH_DAY_LENGTH = 1; // in earth days

export const MARS_RADIUS = 3_390;
export const MARS_FARTHEST_DISTANCE = 249_200_000;
export const MARS_CLOSEST_DISTANCE = 206_700_000;
export const MARS_ECCENTRICITY = 0.09341233;
export const MARS_ORBIT_ANGLE = 0.0349066; // in radians
export const MARS_ORBIT_PERIOD = 1.8808158; // in earth years
export const MARS_DAY_LENGTH = 1.02595675; // in earth days

export const JUPITER_RADIUS = 69_911;
export const JUPITER_FARTHEST_DISTANCE = 816_520_000;
export const JUPITER_CLOSEST_DISTANCE = 740_550_000;
export const JUPITER_ECCENTRICITY = 0.04839266;
export const JUPITER_ORBIT_ANGLE = 0.0172028; // in radians
export const JUPITER_ORBIT_PERIOD = 11.862615; // in earth years
export const JUPITER_DAY_LENGTH = 0.41353; // in earth days

export const SATURN_RADIUS = 58_232;
export const SATURN_FARTHEST_DISTANCE = 1_514_500_000;
export const SATURN_CLOSEST_DISTANCE = 1_352_550_000;
export const SATURN_ECCENTRICITY = 0.0541506;
export const SATURN_ORBIT_ANGLE = 0.0093132; // in radians
export const SATURN_ORBIT_PERIOD = 29.447498; // in earth years
export const SATURN_DAY_LENGTH = 10.6585; // in earth days

export const URANUS_RADIUS = 25_362;
export const URANUS_FARTHEST_DISTANCE = 3_003_600_000;
export const URANUS_CLOSEST_DISTANCE = 2_748_900_000;
export const URANUS_ECCENTRICITY = 0.04716771;
export const URANUS_ORBIT_ANGLE = 0.007699; // in radians
export const URANUS_ORBIT_PERIOD = 84.016846; // in earth years
export const URANUS_DAY_LENGTH = 17.239242; // in earth days

export const NEPTUNE_RADIUS = 24_622;
export const NEPTUNE_FARTHEST_DISTANCE = 4_545_300_000;
export const NEPTUNE_CLOSEST_DISTANCE = 4_452_900_000;
export const NEPTUNE_ECCENTRICITY = 0.00858587;
export const NEPTUNE_ORBIT_ANGLE = 0.0039828; // in radians
export const NEPTUNE_ORBIT_PERIOD = 164.79132; // in earth years
export const NEPTUNE_DAY_LENGTH = 164.79132; // in earth days

export const EARTH_MOON_RADIUS = 1_737.4;
export const EARTH_MOON_DISTANCE = 384_400;
export const EARTH_MOON_ORBIT_PERIOD = 0.0748; // in earth years
export const EARTH_MOON_DAY_LENGTH = 27.321661; // in earth days

export const PLANETS = [
  { key: 'MERCURY' },
  { key: 'VENUS' },
  {
    key: 'EARTH',
    moons: ['EARTH_MOON'],
  },
  { key: 'MARS' },
  { key: 'JUPITER' },
  { key: 'SATURN' },
  { key: 'URANUS' },
  { key: 'NEPTUNE' },
] satisfies { key: string; moons?: string[] }[];
