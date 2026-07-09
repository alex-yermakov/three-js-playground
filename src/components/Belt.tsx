import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';

import { BELT_CLOSEST_DISTANCE, BELT_FARTHEST_DISTANCE } from '../constants';
import { applySizes, pixelRatio, scaleDistance } from '../utils';
import asteroidAlphaTexture from '../textures/circle-alpha-map.png';

const beltClosestDistance = scaleDistance(BELT_CLOSEST_DISTANCE);
const beltFarthestDistance = scaleDistance(BELT_FARTHEST_DISTANCE);
const beltWidth = beltFarthestDistance - beltClosestDistance;

const minSize = 0.005;
const maxSize = 0.3;

const count = 10_000;

export default function Belt() {
  const texture = useTexture(asteroidAlphaTexture);

  const points = useMemo(() => {
    return new Float32Array(
      Array.from({ length: count }, () => {
        const theta = Math.random() * Math.PI * 2;

        const rDisplacement = Math.random() - 0.5;
        const r = beltClosestDistance + ((1 + (2 * rDisplacement) ** 2 * Math.sign(rDisplacement)) * beltWidth) / 2;

        const x = r * Math.cos(theta);
        const z = -r * Math.sin(theta);
        const y = (Math.random() - 0.5) * 0.5;

        return [x, y, z];
      }).flat()
    );
  }, []);

  const sizes = useMemo(() => {
    return new Float32Array(count).map(() => {
      return (minSize + Math.random() * (maxSize - minSize)) * pixelRatio;
    });
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>

      <pointsMaterial
        color={0x505050}
        alphaMap={texture}
        depthWrite={false}
        onBeforeCompile={(shader) => {
          shader.vertexShader = applySizes(shader.vertexShader);
        }}
        sizeAttenuation
        transparent
      />
    </points>
  );
}
