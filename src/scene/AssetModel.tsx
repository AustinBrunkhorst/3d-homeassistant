import * as THREE from "three";
import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import { AssetMetadata } from "store/asset.model";

export interface ModelAssetProps {
  asset: AssetMetadata;
  position: THREE.Vector3;
}

const modelCache = {};

function fetchModel(path: string): Promise<THREE.Object3D> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    // Load a glTF resource
    loader.load(path,
      // called when the resource is loaded
      function onModelLoad(gltf: GLTF) {
        const [model] = gltf.scene.children;

        model.updateMatrix();

        const mesh = model as THREE.Mesh;

        mesh.geometry.applyMatrix(model.matrix);

        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        mesh.updateMatrix();

        resolve(model.clone());
      },
      function onModelProgress(e: ProgressEvent) {
        console.debug('fetchModel progress', path, e);
      },
      function onModelError(e: ErrorEvent) {
        console.error(`fetchModel load failed`, path, e);

        reject(e);
      }
    );
  });
}

async function loadModelAsset({ guid, model }: AssetMetadata) {
  const cacheEntry = modelCache[guid];

  if (cacheEntry) {
    return Promise.resolve(cacheEntry);
  }

  const modelObject = await fetchModel(model);

  modelCache[guid] = modelObject;

  return modelObject;
}

export default function ModelAsset({ asset, position }: ModelAssetProps) {
  const [model, setModel] = useState<THREE.Object3D>();

  useEffect(() => {
    const load = async () => {
      try {
        setModel(await loadModelAsset(asset));
      }
      catch (e) {
        console.error(ModelAsset);
      }
    };

    load();
  }, [asset]);

  return model ? (
    <primitive object={model} position={position} castShadow receiveShadow />
  ) : (
      <mesh position={position} castShadow receiveShadow>
        <boxBufferGeometry attach="geometry" args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial
          attach="material"
          color="red"
          emissive="red"
          emissiveIntensity={10}
        />
      </mesh>
    );
}
