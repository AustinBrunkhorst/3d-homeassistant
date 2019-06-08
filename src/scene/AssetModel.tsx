import React, { useEffect, useMemo, useState } from 'react';
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
    loadModelAsset(asset)
      .then(setModel)
      .catch(e => console.error("<ModelAsset /> loadModelAsset() failed", e));
  }, [asset]);

  const modelObject = useMemo(
    () => <primitive object={model} position={position} />,
    [model, position]
  );

  const fallbackObject = useMemo(
    () => (
      <mesh position={position}>
        <boxBufferGeometry attach="geometry" args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial
          attach="material"
          color="red"
          emissive="red"
          emissiveIntensity={10}
        />
      </mesh>
    ),
    [position]
  );

  return model ? modelObject : fallbackObject;
}

export default ModelAsset;
