import React, { memo, useMemo, useState } from 'react';
import { useRender } from 'react-three-fiber';
import { FrontSide, Math as ThreeMath, Mesh, Scene } from 'three';

import * as actions from 'store/zoneEditor.actions';
import AssetModel from './AssetModel';
import useZoneEditorState from './hooks/ZoneEditorState';
import ThreeTransformControls from './TransformControls';

function ZoneEditorObjects({ droppedAssets, dragState }) {
  const [, setState] = useState(dragState);

  useRender(() => {
    setState(dragState.current);
  });

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
      <Ground />
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

const groundObjectName = "ground";

export function getGroundObject(scene: Scene) {
  return scene && (scene.getObjectByName(groundObjectName) as Mesh);
}

const Ground = memo(() => (
  <mesh
    name={groundObjectName}
    rotation={[-ThreeMath.degToRad(90), 0, ThreeMath.degToRad(90)]}
  >
    <planeGeometry attach="geometry" args={[2, 2]} />
    <meshBasicMaterial attach="material" color="#6cdcd1" side={FrontSide} />
  </mesh>
));

const SelectableAssetModel = ({ id, asset, position, selected }: any) => {
  const [object, setObject] = useState();
  const [, dispatch] = useZoneEditorState();

  const selectAsset = () => dispatch(actions.selectAsset({ instanceId: id }));

  return (
    <>
      <AssetModel
        ref={setObject}
        key={id}
        asset={asset}
        position={position}
        onClick={selectAsset}
      />
      {object && selected && <ThreeTransformControls object={object} />}
    </>
  );
};

export default ZoneEditorObjects;
