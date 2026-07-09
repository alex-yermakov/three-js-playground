import { useContext, useLayoutEffect, useMemo, useRef } from 'react';
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
  cfg: TRingsConfig;
  alphaMap: string;
};

export default function Rings({ cfg, alphaMap }: TRingsProps) {
  const { focus } = useContext(OrbitContext);

  const alphaTexture = useTexture(alphaMap);
  const geometryRef = useRef<RingGeometry>(null);
  const ref = useRef<Mesh>(null);

  const innerRadius = useMemo(() => scaleSize(cfg.closestDistance), [cfg.closestDistance]);
  const outerRadius = useMemo(() => scaleSize(cfg.farthestDistance), [cfg.farthestDistance]);

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
