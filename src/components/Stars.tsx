import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { Color, Vector3 } from 'three';

import starAlphaTexture from '../textures/circle-alpha-map.png';
import { config } from '../config';
import { applySizes, pixelRatio } from '../utils';

const reddish = new Color(0xffb3a7);
const bluish = new Color(0xa9c7ff);

export default function Stars() {
  const texture = useTexture(starAlphaTexture);

  const points = useMemo(() => {
    return new Float32Array(
      Array.from({ length: config.starsCount }, () => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.PI / 2 + Math.asin(Math.random() * 2 - 1);
        const r = config.starMaxDistance - config.starSpread * Math.random();

        return new Vector3().setFromSphericalCoords(r, phi, theta).toArray();
      }).flat()
    );
  }, []);

  const sizes = useMemo(() => {
    return new Float32Array(config.starsCount).map(() => {
      return (0.25 + Math.random() * 0.5) * pixelRatio;
    });
  }, []);

  const colors = useMemo(() => {
    return new Float32Array(
      Array.from({ length: config.starsCount }, () => {
        const blueFactor = Math.random();
        const redFactor = Math.random() ** 2;

        return new Color('white').lerp(reddish, redFactor).lerp(bluish, blueFactor).toArray();
      }).flat()
    );
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>

      <pointsMaterial
        color="white"
        alphaMap={texture}
        onBeforeCompile={(shader) => {
          shader.vertexShader = applySizes(shader.vertexShader);
        }}
        sizeAttenuation
        vertexColors
        transparent
      />
    </points>
  );
}
