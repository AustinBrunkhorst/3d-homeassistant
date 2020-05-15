import { HassEntity } from "home-assistant-js-websocket";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Color, Vector3 } from "three";
import { SceneObject, LightObject, ModelObject } from "store/models/areaEditor.model";
import { selectEntityById } from "store/selectors/hass.selector";
import AssetModel from "./AssetModel";

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

function Light({ entityId, position, intensity, distance, decay }) {
  const lightEntity = useSelector(selectEntityById(entityId));
  const color = useMemo(() => getColorFromState(lightEntity), [lightEntity]);
  const brightness = useMemo(() => getBrightnessFromState(lightEntity), [lightEntity]);

  const light = useMemo(() => {
    return (
      <pointLight
        position={new Vector3(position.x, position.y, position.z)}
        color={color}
        intensity={brightness * intensity}
        distance={distance}
        decay={decay}
      />
    );
  }, [brightness, color, decay, distance, intensity, position.x, position.y, position.z]);

  return light;
}

interface AreaObjectsProps {
  objects: SceneObject[];
}

function AreaObjects({ objects }: AreaObjectsProps) {
  const lights = useMemo(
    () =>
      (objects as LightObject[]).filter(({ type }) => type === 'light').map(({ id, entityId, transform: { position }, intensity, distance, decay }) => (
        <Light
          key={id}
          entityId={entityId}
          position={position}
          intensity={intensity}
          distance={distance}
          decay={decay}
        />
      )),
    [objects]
  );

  const models = useMemo(
    () =>
      (objects as ModelObject[]).filter(({ type }) => type === 'model').map(({ id, model, transform: { position, rotation, scale } }) => (
        <AssetModel
          key={id}
          model={model}
          position={position}
          rotation={rotation}
          scale={scale}
        />
      )),
    [objects]
  );

  return (
    <>
      {models}
      {lights}
    </>
  );
}

export default AreaObjects;
