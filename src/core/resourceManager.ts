import { Box3, Cache, Group, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Model } from "store/models/areaEditor.model";

Cache.enabled = true;

function fetchModel(path: string): Promise<Object3D> {
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

        scene.remove(rootGroup);

        const group = new Group();

        group.add(rootGroup);

        const bbox = new Box3().setFromObject(rootGroup);
        const center = new Vector3();
        const size = new Vector3();

        bbox.getCenter(center);
        bbox.getSize(size);

        // center on ground
        center.y -= size.y * 0.5;

        rootGroup.position.sub(center);

        resolve(group);
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

export async function loadModelAsset({ model }: Model) {
  return await fetchModel(model);
}
