import { Box3, Vector3 } from "three";

/**
 * Gets all verticies in world space of the given box
 * @param box
 */
export function getBoxVerts(box: Box3): Vector3[] {
  const { min, max } = box;

  return [
    new Vector3(min.x, min.y, min.z), // 000
    new Vector3(min.x, min.y, max.z), // 001
    new Vector3(min.x, max.y, min.z), // 010
    new Vector3(min.x, max.y, max.z), // 011
    new Vector3(max.x, min.y, min.z), // 100
    new Vector3(max.x, min.y, max.z), // 101
    new Vector3(max.x, max.y, min.z), // 110
    new Vector3(max.x, max.y, max.z) // 111
  ];
}
