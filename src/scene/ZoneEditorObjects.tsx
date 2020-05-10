import { HassEntity } from "home-assistant-js-websocket";
import React, { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useFrame, useResource } from "react-three-fiber";
import {
    Color, FrontSide, MathUtils as ThreeMath, Mesh, Object3D, PointLight, Quaternion, Scene,
    Vector3,
} from "three";
import { SceneObject } from "store/models/areaEditor.model";
import { selectSelectedObjectIds } from "store/selectors/areaEditor.selector";
import { selectEntityById } from "store/selectors/hass.selector";
import AssetModel from "./AssetModel";
import { useSceneObject } from "./hooks/SceneObject";

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
  const lightEntity = useSelector(selectEntityById(entityId));
  const [ref, object] = useResource<PointLight>();
  const { selectObject, renderTransformControls } = useSceneObject(id, object);

  const color = useMemo(() => getColorFromState(lightEntity), [lightEntity]);
  const brightness = useMemo(() => getBrightnessFromState(lightEntity), [lightEntity]);
  
  const light = useMemo(() => {
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
  }, [brightness, color, decay, distance, intensity, position.x, position.y, position.z, ref]);

  const sceneObject = useMemo(() => {
    return (
      <mesh position={new Vector3(position.x, position.y, position.z)} onClick={selectObject}>
        <sphereBufferGeometry attach="geometry" args={[0.05]} />
        <meshStandardMaterial
          attach="material"
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    );
  }, [position.x, position.y, position.z, selectObject, color]);

  return <>
    {light}
    {!selected && sceneObject}
    {object && selected && (
      <>
        <pointLightHelper args={[object]} />
        {renderTransformControls()}
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
        <DropPreview object={dragState.current.object} position={dragState.current.position} />
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

interface DropPreviewProps {
  object: SceneObject;
  position: Vector3;
}

const DropPreview = ({ object, position }: DropPreviewProps) => {
  return (
    object.type === "model" 
      ? (
        <AssetModel
          model={object.model}
          position={position}
          rotation={new Quaternion()}
          scale={new Vector3(1, 1, 1)}
        />
      )
      : (
        <mesh position={position}>
          <sphereBufferGeometry attach="geometry" args={[0.25]} />
          <meshStandardMaterial
            attach="material"
            color="red"
            emissive={new Color("white")}
            emissiveIntensity={10}
          />
        </mesh>
      )
  );
}

const SelectableAssetModel = ({ id, model, position, rotation, scale, selected }: any) => {
  const [object, setObject] = useState<Object3D>();
  const { selectObject, renderTransformControls } = useSceneObject(id, object);

  return (
    <>
      <AssetModel
        ref={setObject}
        key={id}
        model={model}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={selectObject}
      />
      {object && selected && renderTransformControls()}
    </>
  );
};

export default ZoneEditorObjects;
