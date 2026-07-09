import { createContext, RefObject } from 'react';
import { Object3D, Vector3 } from 'three';

export const OrbitContext = createContext<{
  focus: RefObject<Object3D | null>;
  getPosition: (theta: number) => Vector3;
}>({
  focus: { current: null },
  getPosition: () => new Vector3(),
});
