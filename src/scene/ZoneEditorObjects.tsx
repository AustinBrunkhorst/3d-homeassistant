import { HassEntity } from "home-assistant-js-websocket";
import React, { memo, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFrame, useResource } from "react-three-fiber";
import {
    Color, FrontSide, MathUtils as ThreeMath, Mesh, PointLight, Quaternion, Scene, Vector3,
} from "three";
import { useDebouncedCallback } from "use-debounce";
import * as actions from "store/actions";
import { selectSelectedObjectIds } from "store/selectors/areaEditor.selector";
import { selectEntityById } from "store/selectors/hass.selector";
import AssetModel from "./AssetModel";
import ThreeTransformControls from "./TransformControls";

function getColorFromState(light?: HassEntity) {
  if (!light || light.state !== "on" || !light.attributes.rgb_color) {
    return new Color();
  }

  return new Color(...light.attributes.rgb_color.map((c: number) => c / 255));
}

function getBrightnessFromState(light?: HassEntity) {
  if (!light || light.state !== "on") {
    return 0;
  }

  return light.attributes.brightness / 255;
}

function Light({ id, entityId, selected, position, intensity, distance, decay }) {
  const dispatch = useDispatch();
  const lightEntity = useSelector(selectEntityById(entityId));
  const [ref, object] = useResource<PointLight>();
  
  const light = useMemo(() => {
    const color = getColorFromState(lightEntity);
    const brightness = getBrightnessFromState(lightEntity);

    return (
      <pointLight
        ref={ref}
        position={new Vector3(position.x, position.y, position.z)}
        color={color}
        intensity={brightness * intensity}
        distance={distance}
        decay={decay}
      />
    );
  }, [decay, distance, intensity, lightEntity, position.x, position.y, position.z, ref]);

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

  return <>
    {light}
    {object && selected && (
      <>
        <pointLightHelper args={[object]} />
        <ThreeTransformControls object={object} onChange={saveState} />
      </>
    )}
  </>;
}

function ZoneEditorObjects({ droppedAssets, dragState }) {
  const [, setState] = useState(dragState);
  const selectedObjects = useSelector(selectSelectedObjectIds);

  useFrame(() => {
    setState(dragState.current);
  });

  const lights = useMemo(
    () =>
      droppedAssets.filter(({ type }) => type === 'light').map(({ id, entityId, transform: { position }, intensity, distance, decay }) => (
        <Light
          id={id}
          entityId={entityId}
          key={id}
          position={position}
          selected={selectedObjects.includes(id)}
          intensity={intensity}
          distance={distance}
          decay={decay}
        />
      )),
    [droppedAssets, selectedObjects]
  );

  const models = useMemo(
    () =>
      droppedAssets.filter(({ type }) => type === 'model').map(({ id, model, transform: { position, rotation, scale } }) => (
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
      {models}
      {lights}
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
    castShadow
    receiveShadow
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
