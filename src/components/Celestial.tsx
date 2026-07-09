import { useCallback, useMemo, useRef } from 'react';
import { TCelestialConfig } from '../objects/celestial';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { calculateOrbitalProgress, calculateRotationProgress, scaleDistance, scaleSize } from '../utils';
import { useTexture } from '@react-three/drei';
import { config } from '../config';

export default function Celestial(props: { cfg: TCelestialConfig; map?: string; orbit?: boolean }) {
  const ref = useRef<Mesh>(null);

  const texture = useTexture(props.map);

  const radius = useMemo(() => scaleSize(props.cfg.radius), [props.cfg.radius]);
  const semiMajorAxis = useMemo(() => scaleDistance(props.cfg.semiMajorAxis), [props.cfg.radius]);

  const getPosition = useCallback(
    (theta: number) => {
      const alpha = props.cfg.orbitAngle * Math.cos(theta); // orbit's skew -> current Y displacement angle
      const r = (semiMajorAxis * (1 - props.cfg.eccentricity ** 2)) / (1 + props.cfg.eccentricity * Math.cos(theta));

      const x = r * Math.cos(theta) * Math.cos(alpha);
      const z = -r * Math.sin(theta) * Math.cos(alpha);
      const y = r * Math.sin(alpha);

      return new Vector3(x, y, z);
    },
    [semiMajorAxis, props.cfg.eccentricity, props.cfg.orbitAngle]
  );

  useFrame(({ clock }) => {
    if (ref.current == null) {
      return;
    }

    const time = clock.getElapsedTime();
    const orbitalProgress = calculateOrbitalProgress(time);
    const rotationProgress = calculateRotationProgress(time);

    const orbitalAngle = (orbitalProgress * Math.PI * 2) / props.cfg.orbitPeriod;
    const rotationAngle = (rotationProgress * Math.PI * 2) / props.cfg.dayLength;

    ref.current.position.copy(getPosition(orbitalAngle));
    ref.current.rotation.y = rotationAngle;
  });

  return (
    <>
      <mesh ref={ref} scale={radius} castShadow receiveShadow>
        <sphereGeometry args={[1, 256, 128]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {props.orbit && <Orbit color={props.cfg.orbitColor} getPosition={getPosition} />}
    </>
  );
}

function Orbit(props: { color: number; getPosition: (theta: number) => Vector3 }) {
  const points = useMemo(() => {
    return new Float32Array(
      Array.from({ length: config.orbitResolution }, (_, i) =>
        props.getPosition((i * Math.PI * 2) / config.orbitResolution).toArray()
      ).flat()
    );
  }, [props.getPosition]);

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>

      <lineBasicMaterial color={props.color} opacity={config.orbitOpacity} transparent />
    </lineLoop>
  );
}
