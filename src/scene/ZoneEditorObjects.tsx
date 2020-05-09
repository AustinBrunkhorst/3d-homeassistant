import { HassEntity } from "home-assistant-js-websocket";
import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFrame, useResource } from "react-three-fiber";
import {
    Color, FrontSide, MathUtils as ThreeMath, Mesh, PointLight, Quaternion, Scene, Vector3, Object3D,
} from "three";
import * as actions from "store/actions";
import { selectSelectedObjectIds } from "store/selectors/areaEditor.selector";
import { selectEntityById } from "store/selectors/hass.selector";
import AssetModel from "./AssetModel";
import ThreeTransformControls from "./TransformControls";
import { SceneObject } from "store/models/areaEditor.model";

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

function useSceneObject(id: number, threeObject?: Object3D) {
  const dispatch = useDispatch();

  const saveTransform = useCallback((e) => {
    const { position, quaternion, scale } = e.target.object;

    dispatch(actions.updateObjectTransform({
      id,
      transform: {
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
        scale: { x: scale.x, y: scale.y, z: scale.z },
      }
    }));
  }, [id, dispatch]);

  const [isUsingTransformTool, setIsUsingTransformTool] = useState(false);

  const selectObject = useCallback(() => {
    if (isUsingTransformTool) {
      return;
    }

    dispatch(actions.selectObject({ id }))
  }, [id, dispatch, isUsingTransformTool]);

  const timerHandle = useRef<any>(0);

  const onMouseDown = useCallback(() => {
    setIsUsingTransformTool(true);
  }, [setIsUsingTransformTool]);

  const onMouseUp = useCallback(() => {
    timerHandle.current = setTimeout(() => setIsUsingTransformTool(false), 10);
  }, [setIsUsingTransformTool]);

  useEffect(() => {
    const currentHandle = timerHandle.current;

    return () => {
      if (currentHandle) {
        clearTimeout(currentHandle);
      }
    };
  }, []);

  const renderTransformControls = useCallback(() => {
    if (!threeObject) {
      return null;
    }

    return (
      <ThreeTransformControls
        object={threeObject}
        onChange={saveTransform}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    );
  }, [onMouseDown, onMouseUp, saveTransform, threeObject]);

  return { selectObject, renderTransformControls };
}

function Light({ id, entityId, selected, position, intensity, distance, decay }) {
  const lightEntity = useSelector(selectEntityById(entityId));
  const [ref, object] = useResource<PointLight>();
  const { selectObject, renderTransformControls } = useSceneObject(id, object);
  
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

  const sceneObject = useMemo(() => {
    return (
      <mesh position={new Vector3(position.x, position.y, position.z)} onPointerDown={selectObject}>
        <sphereBufferGeometry attach="geometry" args={[0.15]} />
        <meshStandardMaterial
          attach="material"
          color="white"
          emissive={new Color("white")}
          emissiveIntensity={1}
        />
      </mesh>
    );
  }, [selectObject, position]);

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
