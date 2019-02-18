import { OrthographicCamera, Object3D, Box3, Vector3 } from "three";
import { getBoxVerts } from "./Math";

const unitX = new Vector3(1, 0, 0);
const unitY = new Vector3(0, 1, 0);

export function fitOrthoDimensionsToObjects(
  camera: OrthographicCamera,
  objects: Object3D[]
): [number, number] {
  let maxWidth = -Infinity;
  let maxHeight = -Infinity;

  const box = new Box3();

  camera.updateMatrixWorld(true);

  for (const child of objects) {
    box.setFromObject(child);

    for (const vert of getBoxVerts(box)) {
      vert.applyMatrix4(camera.matrixWorldInverse);
      maxWidth = Math.max(maxWidth, Math.abs(unitX.dot(vert)));
      maxHeight = Math.max(maxHeight, Math.abs(unitY.dot(vert)));
    }
  }

  return [maxWidth, maxHeight];
}
