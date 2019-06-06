import * as THREE from "three";
import React from "react";

const dragPreviewSize = new THREE.Vector3(2, 2, 2);

export default function DraggedAssetPreview({ position }) {
  const offset = position.clone();

  offset.y += dragPreviewSize.y / 2;

  return (
    <mesh position={offset} castShadow recieveShadow>
      <boxBufferGeometry attach="geometry" args={dragPreviewSize.toArray()} />
      <meshPhongMaterial
        attach="material"
        color="green"
        emissive="green"
        emissiveIntensity={10}
      />
    </mesh>
  );
}