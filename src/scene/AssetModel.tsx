import * as THREE from "three";
import React from "react";
import { useState, useEffect } from "react";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import { AssetMetadata } from "store/asset.model";

export interface ModelAssetProps {
  asset: AssetMetadata;
  position: THREE.Vector3;
}

export default function ModelAsset({ asset, position }: ModelAssetProps) {
  const [model, setModel] = useState<THREE.Object3D>();

  useEffect(() => {
    // Instantiate a loader
    const loader = new GLTFLoader();

    // Load a glTF resource
    loader.load(
      // resource URL
      asset.model,
      // called when the resource is loaded
      function onModelLoad(gltf: GLTF) {
        setModel(gltf.scene.children[0]);
      }
    );
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
