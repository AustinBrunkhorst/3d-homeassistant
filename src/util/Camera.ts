import { OrthographicCamera, Object3D, Box3 } from "three";

import { getBoxVerts } from "./Geometry";
import { unitX, unitY } from "./Vector";

function fitOrthoDimensionsToObjects(
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
      const local = vert.clone().applyMatrix4(camera.matrixWorldInverse);

      maxWidth = Math.max(maxWidth, Math.abs(unitX.dot(local)));
      maxHeight = Math.max(maxHeight, Math.abs(unitY.dot(local)));
    }
  }

  return [maxWidth, maxHeight];
}

export function fitObjectsInViewport(
  viewportWidth: number,
  viewportHeight: number,
  camera: OrthographicCamera,
  objects: Object3D[]
): [number, number] {
  const aspect = viewportWidth / viewportHeight;
  const inverseAspect = viewportHeight / viewportWidth;

  const [maxFrustumWidth, maxFrustumHeight] = fitOrthoDimensionsToObjects(
    camera,
    objects
  );

  const frustumWidth = maxFrustumWidth * (aspect > 1.0 ? aspect : 1.0);

  const frustumHeight =
    maxFrustumHeight * (inverseAspect > 1.0 ? inverseAspect : 1.0);

  return [frustumWidth, frustumHeight];
}

export function getOrthoDimensions(camera: OrthographicCamera) {
  const width = camera.right;
  const height = camera.top;

  return [width, height];
}

export function setOrthoDimensions(
  camera: OrthographicCamera,
  width: number,
  height: number
): void {
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;

  camera.updateProjectionMatrix();
}
