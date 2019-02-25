import { IFbxSceneGraph } from "three";

const FBXLoader = require("../lib/threejs/FBXLoader");

export function importFbx(
  path: string,
  onProgress?: (progress: number) => void
): Promise<IFbxSceneGraph> {
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader();

    loader.load(
      path,
      (result: IFbxSceneGraph) => resolve(result),
      (event: ProgressEvent) =>
        onProgress &&
        onProgress(event.lengthComputable ? event.loaded / event.total : 0),
      (error: Error) => reject(error)
    );
  });
}
