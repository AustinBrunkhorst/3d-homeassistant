import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { AssetMetadata } from 'store/asset.models';

THREE.Cache.enabled = true;

function fetchModel(path: string): Promise<THREE.Object3D> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      function onModelLoad({ scene }) {
        const [rootGroup] = scene.children;

        if (!rootGroup) {
          console.log(
            "fetchModel expected scene.children[0] but got",
            rootGroup
          );

          return reject();
        }

        rootGroup.position.set(0, 0, 0);

        resolve(rootGroup);
      },
      function onModelProgress(e) {
        console.debug("fetchModel progress", path, e);
      },
      function onModelError(e: ErrorEvent) {
        console.error(`fetchModel load failed`, path, e);

        reject(e);
      }
    );
  });
}

export async function loadModelAsset({ model }: AssetMetadata) {
  return await fetchModel(model);
}
