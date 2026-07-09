import { useContext, useMemo } from 'react';

import { config } from '../config';
import { OrbitContext } from './OrbitContext';
import Celestial, { TCelestialProps } from './Celestial';

export type TPlanetProps = TCelestialProps;

export default function Planet({ cfg, map, children }: TPlanetProps) {
  return (
    <Celestial cfg={cfg} map={map}>
      <Orbit color={cfg.orbitColor} />

      {children}
    </Celestial>
  );
}

function Orbit(props: { color: number }) {
  const { getPosition } = useContext(OrbitContext);

  const points = useMemo(() => {
    return new Float32Array(
      Array.from({ length: config.orbitResolution }, (_, i) =>
        getPosition((i * Math.PI * 2) / config.orbitResolution).toArray()
      ).flat()
    );
  }, [getPosition]);

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>

      <lineBasicMaterial color={props.color} opacity={config.orbitOpacity} transparent />
    </lineLoop>
  );
}
