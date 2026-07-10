import { createContext } from 'react';
import { Object3D, Vector3 } from 'three';

export const OrbitContext = createContext<{
  focus: Object3D | null;
  getPosition: (theta: number) => Vector3;
}>({
  focus: null,
  getPosition: () => new Vector3(),
});
