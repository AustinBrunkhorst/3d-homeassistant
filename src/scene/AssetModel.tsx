import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

import { loadModelAsset } from 'core/resourceManager';
import { AssetMetadata } from 'store/asset.models';

export interface ModelAssetProps {
  asset: AssetMetadata;
  position: THREE.Vector3;
}

function ModelAsset({ asset, position }: ModelAssetProps) {
  const [model, setModel] = useState<THREE.Object3D>();

  useEffect(() => {
    console.log("useEffect", asset.title);
    loadModelAsset(asset)
      .then(setModel)
      .catch(e => console.error(`<ModelAsset /> loadModelAsset() failed`, e));
  }, [asset]);

  console.log("render", asset.title);

  return model ? (
    <primitive object={model} position={position} />
  ) : (
    <mesh position={position}>
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

export default ModelAsset;
