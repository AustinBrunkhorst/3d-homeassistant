import { Object3D } from "three";

const FBXLoader = require("../lib/threejs/FBXLoader");

const sceneCache = new Map<string, Object3D>();

export function importFbx(
  path: string,
  onProgress?: (progress: number) => void
): Promise<Object3D> {
  return new Promise((resolve, reject) => {
    const cachedResult = sceneCache.get(path);

    if (cachedResult !== undefined) {
      console.log(`[fbx] using cached version of ${path}`);

      return resolve(cachedResult);
    }

    const loader = new FBXLoader();

    loader.load(
      path,
      (result: Object3D) => {
        const resultCopy = result.clone();

        sceneCache.set(path, resultCopy);

        resolve(resultCopy);
      },
      (event: ProgressEvent) =>
        onProgress &&
        onProgress(event.lengthComputable ? event.loaded / event.total : 0),
      (error: Error) => reject(error)
    );
  });
}
