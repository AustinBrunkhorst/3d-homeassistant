import React, { memo, useCallback, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch } from "react-redux";
import { useRender } from "react-three-fiber";
import { FrontSide, Math as ThreeMath, Mesh, Quaternion, Scene, Vector3 } from "three";
import { useDebouncedCallback } from "use-debounce";
import * as actions from "store/actions";
import AssetModel from "./AssetModel";
import ThreeTransformControls from "./TransformControls";

function ZoneEditorObjects({ droppedAssets, dragState }) {
  const [, setState] = useState(dragState);

  useRender(() => {
    setState(dragState.current);
  });

  const objects = useMemo(
    () =>
      droppedAssets.map(({ id, asset, position, rotation, scale, selected }) => (
        <SelectableAssetModel
          key={id}
          id={id}
          asset={asset}
          position={position}
          rotation={rotation}
          scale={scale}
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
          rotation={new Quaternion()}
          scale={new Vector3(1, 1, 1)}
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

const SelectableAssetModel = ({ id, asset, position, rotation, scale, selected }: any) => {
  const [object, setObject] = useState();
  const dispatch = useDispatch();
  const [saveState] = useDebouncedCallback((e) => {
    dispatch(actions.updateObjectTransform({
      instanceId: id,
      position: e.target.object.position,
      rotation: e.target.object.quaternion,
      scale: e.target.object.scale,
    }));
  }, 50);

  const selectAsset = () => dispatch(actions.selectObject({ instanceId: id }));

  useHotkeys("delete", () => {
    if (selected) {
      dispatch(actions.deleteObject(id));
    }
  }, [id, dispatch, selected]);

  return (
    <>
      <AssetModel
        ref={setObject}
        key={id}
        asset={asset}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={selectAsset}
      />
      {object && selected && <ThreeTransformControls object={object} onChange={saveState} />}
    </>
  );
};

export default ZoneEditorObjects;
