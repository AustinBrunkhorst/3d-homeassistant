import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useRender, useResource, useThree, useUpdate } from 'react-three-fiber';
import { FrontSide, Math as ThreeMath, Object3D } from 'three';

import AssetModel from './AssetModel';
import TransformControls from './TransformControls';

function ZoneEditorObjects({ droppedAssets, dragState }) {
  const [, setState] = useState(dragState);

  useRender(() => {
    setState(dragState.current);
  });

  const ground = useMemo(
    () => (
      <mesh
        name="ground"
        rotation={[-ThreeMath.degToRad(90), 0, ThreeMath.degToRad(90)]}
      >
        <planeGeometry attach="geometry" args={[10, 10]} />
        <meshBasicMaterial attach="material" color="#6cdcd1" side={FrontSide} />
      </mesh>
    ),
    []
  );

  const objects = useMemo(
    () =>
      droppedAssets.map(({ id, asset, position, selected }) => (
        <SelectableAssetModel
          key={id}
          id={id}
          asset={asset}
          position={position}
          selected={selected}
        />
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

const SelectableAssetModel = ({ id, asset, position, selected }: any) => {
  const [object, setObject] = useState<any>();

  return (
    <>
      <AssetModel ref={setObject} key={id} asset={asset} position={position} />
      {object && selected && <TransformControls object={object} />}
    </>
  );
};

export default ZoneEditorObjects;
