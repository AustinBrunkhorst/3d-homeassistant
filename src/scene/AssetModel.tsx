import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

import { loadModelAsset } from 'core/resourceManager';
import { AssetMetadata } from 'store/asset.models';

export interface ModelAssetProps {
  asset: AssetMetadata;
  position: THREE.Vector3;
  onClick?: () => void;
}

function ModelAsset({ asset, position, onClick }: ModelAssetProps) {
  const [model, setModel] = useState<THREE.Object3D>();

  useEffect(() => {
    let connected = true;

    loadModelAsset(asset)
      .then(result => {
        if (connected) {
          setModel(result);
        }
      })
      .catch(e => {
        if (connected) {
          console.error("<ModelAsset /> loadModelAsset() failed", e);
        }
      });

    return () => {
      connected = false;
    };
  }, [asset]);

  const modelObject = useMemo(
    () => <primitive object={model} position={position} onClick={onClick} />,
    [model, position, onClick]
  );

  const loadingObject = useMemo(
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

  return model ? modelObject : loadingObject;
}

export default ModelAsset;
