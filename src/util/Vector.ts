import { Vector3 } from 'three';

export const unitX = new Vector3(1, 0, 0);
export const unitY = new Vector3(0, 1, 0);
export const unitZ = new Vector3(0, 0, 1);

export function snap(vector: Vector3, size: number) {
  const { x, y, z } = vector;

  return new Vector3(
    Math.round(x / size) * size,
    Math.round(y / size) * size,
    Math.round(z / size) * size
  );
}
