import {
  OrthographicCamera,
  Object3D,
  Box3,
  Vector3,
  WebGLRenderer
} from "three";
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

export function fitObjectsInViewport(
  renderer: WebGLRenderer,
  camera: OrthographicCamera,
  objects: Object3D[]
) {
  const { width, height } = renderer.getSize();

  const width2Height = width / height;
  const height2Width = height / width;

  const [maxFrustumWidth, maxFrustumHeight] = fitOrthoDimensionsToObjects(
    camera,
    objects
  );

  const frustumWidth =
    maxFrustumWidth * (width2Height > 1.0 ? width2Height : 1.0);

  const frustumHeight =
    maxFrustumHeight * (height2Width > 1.0 ? height2Width : 1.0);

  camera.left = -frustumWidth;
  camera.right = frustumWidth;
  camera.top = frustumHeight;
  camera.bottom = -frustumHeight;
  camera.near = 0.1;
  camera.far = 100;
  camera.zoom = 1;

  camera.updateProjectionMatrix();
}
