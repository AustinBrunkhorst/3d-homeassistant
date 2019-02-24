import { IFbxSceneGraph, Scene } from "three";

declare var THREE;

require("three/examples/js/loaders/FBXLoader");

export function importFbxBuffer(buffer: ArrayBuffer): Promise<IFbxSceneGraph> {
  const loader = new THREE.FBXLoader();

  return Promise.resolve(loader.parse(buffer));
}
