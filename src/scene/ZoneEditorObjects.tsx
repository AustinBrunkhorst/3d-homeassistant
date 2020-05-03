import React, { memo, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch, useSelector } from "react-redux";
import { useRender } from "react-three-fiber";
import { FrontSide, Math as ThreeMath, Mesh, Quaternion, Scene, Vector3 } from "three";
import { useDebouncedCallback } from "use-debounce";
import * as actions from "store/actions";
import { selectSelectedObjectIds } from "store/selectors/areaEditor.selector";
import AssetModel from "./AssetModel";
import ThreeTransformControls from "./TransformControls";

function ZoneEditorObjects({ droppedAssets, dragState }) {
  const [, setState] = useState(dragState);
  const selectedObjects = useSelector(selectSelectedObjectIds);

  useRender(() => {
    setState(dragState.current);
  });

  const objects = useMemo(
    () =>
      droppedAssets.map(({ id, model, transform: { position, rotation, scale } }) => (
        <SelectableAssetModel
          key={id}
          id={id}
          model={model}
          position={position}
          rotation={rotation}
          scale={scale}
          selected={selectedObjects.includes(id)}
        />
      )),
    [droppedAssets, selectedObjects]
  );

  return (
    <>
      <Ground />
      {objects}
      {dragState.current && (
        <AssetModel
          model={dragState.current.object.model}
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

const SelectableAssetModel = ({ id, model, position, rotation, scale, selected }: any) => {
  const [object, setObject] = useState();
  const dispatch = useDispatch();
  const [saveState] = useDebouncedCallback((e) => {
    dispatch(actions.updateObjectTransform({
      id: id,
      transform: {
        position: { x: e.target.object.position.x, y: e.target.object.position.y, z: e.target.object.position.z },
        rotation: { x: e.target.object.quaternion.x, y: e.target.object.quaternion.y, z: e.target.object.quaternion.z, w: e.target.object.quaternion.w },
        scale: { x: e.target.object.scale.x, y: e.target.object.scale.y, z: e.target.object.scale.z },
      }
    }));
  }, 50);

  const selectAsset = () => dispatch(actions.selectObject({ id: id }));

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
        model={model}
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
