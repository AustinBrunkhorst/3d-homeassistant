import React, { useMemo, useState } from 'react';
import { useRender } from 'react-three-fiber';
import { FrontSide, Math } from 'three';

import AssetModel from './AssetModel';

function ZoneEditorObjects({ droppedAssets, dragState }) {
  const [, setState] = useState(dragState);

  useRender(() => {
    setState(dragState.current);
  });

  const ground = useMemo(
    () => (
      <mesh name="ground" rotation={[-Math.degToRad(90), 0, Math.degToRad(90)]}>
        <planeGeometry attach="geometry" args={[10, 10]} />
        <meshBasicMaterial attach="material" color="#6cdcd1" side={FrontSide} />
      </mesh>
    ),
    []
  );

  const objects = useMemo(
    () =>
      droppedAssets.map(({ id, asset, position }) => (
        <AssetModel key={id} asset={asset} position={position} />
      )),
    [droppedAssets]
  );

  return (
    <>
      {ground}
      {objects}
      {dragState.current && (
        <AssetModel
          asset={dragState.current.asset}
          position={dragState.current.position}
        />
      )}
    </>
  );
}

export default ZoneEditorObjects;
