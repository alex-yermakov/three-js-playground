import { useContext, useLayoutEffect, useRef } from 'react';
import { DoubleSide, Mesh, RingGeometry } from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { OrbitContext } from './OrbitContext';
import { remapRingUVs, scaleSize } from '../utils';

type TRingsConfig = {
  closestDistance: number;
  farthestDistance: number;
  angle: number;
};

type TRingsProps = {
  radius: number;
  cfg: TRingsConfig;
  alphaMap: string;
};

export default function Rings({ cfg, radius, alphaMap }: TRingsProps) {
  const { focus } = useContext(OrbitContext);

  const alphaTexture = useTexture(alphaMap);
  const geometryRef = useRef<RingGeometry>(null);
  const ref = useRef<Mesh>(null);

  const factor = scaleSize(radius) / radius;
  const innerRadius = factor * cfg.closestDistance;
  const outerRadius = factor * cfg.farthestDistance;

  useFrame(() => {
    if (ref.current != null && focus.current != null) {
      ref.current.position.copy(focus.current.position);
    }
  });

  useLayoutEffect(() => {
    if (geometryRef.current != null) {
      remapRingUVs(geometryRef.current, innerRadius, outerRadius);
    }
  }, [innerRadius, outerRadius]);

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} rotation-y={cfg.angle}>
      <ringGeometry ref={geometryRef} args={[innerRadius, outerRadius, 128]} />
      <meshBasicMaterial color={0x808080} side={DoubleSide} alphaMap={alphaTexture} transparent />
    </mesh>
  );
}
