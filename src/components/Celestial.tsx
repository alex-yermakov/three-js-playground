import { PropsWithChildren, useCallback, useContext, useMemo, useRef } from 'react';
import { Mesh, SphereGeometry, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

import { calculateOrbitalProgress, calculateRotationProgress, scaleDistance, scaleSize } from '../utils';
import { OrbitContext } from './OrbitContext';

export type TCelestialConfig = {
  radius: number;
  semiMajorAxis: number;
  eccentricity: number;
  orbitPeriod: number;
  orbitAngle: number;
  dayLength: number;
  axialTilt: number;
  orbitColor?: number;
};

export type TCelestialProps = PropsWithChildren<{
  cfg: TCelestialConfig;
  map?: string;
}>;

const geometry = new SphereGeometry(1, 256, 128);

export default function Celestial({ cfg, map, children }: TCelestialProps) {
  const { focus } = useContext(OrbitContext);

  const ref = useRef<Mesh>(null);
  const texture = useTexture(map ? { map } : {});

  const radius = useMemo(() => scaleSize(cfg.radius), [cfg.radius]);
  const semiMajorAxis = useMemo(() => scaleDistance(cfg.semiMajorAxis), [cfg.semiMajorAxis]);

  const getPosition = useCallback(
    (theta: number) => {
      const alpha = cfg.orbitAngle * Math.cos(theta); // orbit's skew -> current Y displacement angle
      const r = (semiMajorAxis * (1 - cfg.eccentricity ** 2)) / (1 + cfg.eccentricity * Math.cos(theta));

      const x = r * Math.cos(theta) * Math.cos(alpha);
      const z = -r * Math.sin(theta) * Math.cos(alpha);
      const y = r * Math.sin(alpha);

      const center = focus.current?.position.clone() ?? new Vector3();

      return center.add({ x, y, z });
    },
    [semiMajorAxis, cfg.eccentricity, cfg.orbitAngle]
  );

  useFrame(({ clock }) => {
    if (ref.current == null) {
      return;
    }

    const time = clock.getElapsedTime();
    const orbitalProgress = calculateOrbitalProgress(time);
    const rotationProgress = calculateRotationProgress(time);

    const orbitalAngle = (orbitalProgress * Math.PI * 2) / cfg.orbitPeriod;
    const rotationAngle = (rotationProgress * Math.PI * 2) / cfg.dayLength;

    ref.current.position.copy(getPosition(orbitalAngle));
    ref.current.rotation.y = rotationAngle;
  });

  return (
    <group>
      <mesh ref={ref} scale={radius} rotation-z={cfg.axialTilt} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial map={texture.map} />
      </mesh>

      {children && <OrbitContext.Provider value={{ focus: ref, getPosition }}>{children}</OrbitContext.Provider>}
    </group>
  );
}
