import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useRender, useResource, useThree, useUpdate } from 'react-three-fiber';
import { FrontSide, Math as ThreeMath } from 'three';

import AssetModel from './AssetModel';

function ZoneEditorObjects({ droppedAssets, dragState }) {
  const [, setState] = useState(dragState);
  const [draggedObject] = useResource();

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
        <>
          <AssetModel
            ref={draggedObject}
            asset={dragState.current.asset}
            position={dragState.current.position}
          />
        </>
      )}
    </>
  );
}

const SelectableAssetModel = ({ id, asset, position, selected }: any) => {
  const [refObject, object] = useResource();
  const [refTransformControls, transformControls] = useResource();
  const { camera, canvas } = useThree();
  const cameraControls = useRef<any>();

  useEffect(() => {
    function updateCameraControls(e) {
      const isDragging = e.value;

      if (cameraControls.current) {
        cameraControls.current.enabled = !isDragging;
      }
    }

    function handleKeyDown(event) {
      switch (event.keyCode) {
        case 81: // Q
          transformControls.setSpace(
            transformControls.space === "local" ? "world" : "local"
          );
          break;
        case 17: // Ctrl
          transformControls.setTranslationSnap(100);
          transformControls.setRotationSnap(ThreeMath.degToRad(15));
          break;
        case 87: // W
          transformControls.setMode("translate");
          break;
        case 69: // E
          transformControls.setMode("rotate");
          break;
        case 82: // R
          transformControls.setMode("scale");
          break;
        case 187:
        case 107: // +, =, num+
          transformControls.setSize(transformControls.size + 0.1);
          break;
        case 189:
        case 109: // -, _, num-
          transformControls.setSize(
            Math.max(transformControls.size - 0.1, 0.1)
          );
          break;
        case 88: // X
          transformControls.showX = !transformControls.showX;
          break;
        case 89: // Y
          transformControls.showY = !transformControls.showY;
          break;
        case 90: // Z
          transformControls.showZ = !transformControls.showZ;
          break;
        case 32: // Spacebar
          transformControls.enabled = !transformControls.enabled;
      }
    }

    if (object && transformControls && camera) {
      cameraControls.current = camera.userData.controls;

      transformControls.attach(object);

      transformControls.addEventListener(
        "dragging-changed",
        updateCameraControls
      );

      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (transformControls) {
        transformControls.removeEventListener(
          "dragging-changed",
          updateCameraControls
        );
      }

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [object, transformControls, camera, canvas]);

  return (
    <>
      <AssetModel ref={refObject} key={id} asset={asset} position={position} />
      {camera && canvas && selected && (
        <transformControls ref={refTransformControls} args={[camera, canvas]} />
      )}
    </>
  );
};

export default ZoneEditorObjects;
