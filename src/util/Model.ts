const THREE = require("three");

// this is asinine, but it's tracked
// https://github.com/mrdoob/three.js/issues/9562
require("imports-loader?THREE=three,Inflate=zlibjs/bin/inflate.min,Zlib=>Inflate.Zlib!three/examples/js/loaders/FBXLoader");

export function importFbx(
  path: string,
  onProgress?: (progress: number) => void
): Promise<THREE.IFbxSceneGraph> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.FBXLoader();
    loader.load(
      path,
      (result: THREE.IFbxSceneGraph) => resolve(result),
      (event: ProgressEvent) =>
        onProgress &&
        onProgress(event.lengthComputable ? event.loaded / event.total : 0),
      (error: Error) => reject(error)
    );
  });
}
