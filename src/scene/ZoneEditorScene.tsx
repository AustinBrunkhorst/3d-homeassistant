import * as THREE from "three";
import { AxesHelper } from "three/src/helpers/AxesHelper";
import { GridHelper } from "three/src/helpers/GridHelper";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import React, { useState, useRef } from "react";
import { extend, Canvas, useRender } from "react-three-fiber";
import { CanvasContext } from "react-three-fiber/types/src/canvas";
import throttle from "raf-schd";

import { useAssetItemDrop } from "core/dragDrop/assetItem";
import { AssetMetadata } from "store/asset.model";
import Skybox from "./Skybox";
import ZoneEditorCamera from "./ZoneEditorCamera";
import DraggedAssetPreview from "./DraggedAssetPreview";
import ZoneObjects from "./ZoneObjects";

extend({ AxesHelper, GridHelper, MapControls });

function EditorEnvironment({ plane }) {
  const [sunProps, setSunProps] = useState({
    distance: 50,
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    elevation: 0.42,
    azimuth: 0.25
  });

  const sunPosition = useRef(new THREE.Vector3());

  useRender(() => {
    setSunProps({
      ...sunProps,
      azimuth:
        (Math.cos(Date.now() / 900000) + 1) * 0.5 * THREE.Math.degToRad(270)
    });
  });

  return (
    <>
      <ambientLight color="white" />
      <directionalLight position={sunPosition.current} castShadow={true} />
      <gridHelper args={[10, 20]} />
      <mesh
        ref={plane}
        rotation={[THREE.Math.degToRad(90), 0, THREE.Math.degToRad(90)]}
        recieveShadow
      >
        <planeGeometry attach="geometry" args={[40, 40]} />
        <meshBasicMaterial
          attach="material"
          color="#6cdcd1"
          side={THREE.DoubleSide}
        />
      </mesh>

      <Skybox {...sunProps} updateSunPosition={value => sunPosition.current = value} />
    </>
  );
}

function Debug() {
  return <axesHelper args={[4]} position={[-40, 0, -40]} />;
}

interface DragState {
  asset: AssetMetadata;
  targetLocation: THREE.Vector3;
}

interface DroppedAsset {
  asset: AssetMetadata;
  id: number;
  position: THREE.Vector3;
}

const initialItems = [];

export default function ZoneEditorScene() {
  const [, setCreated] = useState(false);
  const context = useRef<CanvasContext>();
  const groundPlane = useRef<THREE.Mesh>();
  const bounds = useRef<any>();
  const [dragSource, setDragSource] = useState<DragState>();
  const [droppedAssets, setDroppedAssets] = useState<DroppedAsset[]>(initialItems);
  const nextId = useRef(0);

  const canDrop = (inputOffset: THREE.Vector2) => {
    const { current: contextInstance } = context;
    const { current: groundPlaneInstance } = groundPlane;

    if (!contextInstance || !groundPlaneInstance) {
      return false;
    }

    const { raycaster } = contextInstance;
    const { current: size } = bounds;

    if (!size) {
      return false;
    }

    const ndc = new THREE.Vector2();

    ndc.x = ((inputOffset.x - size.left) / size.width) * 2 - 1;
    ndc.y = -((inputOffset.y - size.top) / size.height) * 2 + 1;

    raycaster.setFromCamera(ndc, contextInstance.camera);

    const intersects = raycaster.intersectObject(groundPlaneInstance);

    return intersects.length > 0;
  };

  const onHover = throttle(
    (inputOffset: THREE.Vector2, asset: AssetMetadata) => {
      const { current: contextInstance } = context;
      const { current: groundPlaneInstance } = groundPlane;

      if (!contextInstance || !groundPlaneInstance) {
        return;
      }

      const { raycaster } = contextInstance;
      const { current: size } = bounds;

      if (!size) {
        return;
      }

      const ndc = new THREE.Vector2();

      ndc.x = ((inputOffset.x - size.left) / size.width) * 2 - 1;
      ndc.y = -((inputOffset.y - size.top) / size.height) * 2 + 1;

      raycaster.setFromCamera(ndc, contextInstance.camera);

      const intersects = raycaster.intersectObject(groundPlaneInstance);

      if (intersects.length > 0) {
        setDragSource({ asset, targetLocation: intersects[0].point });
      } else {
        setDragSource(undefined);
      }
    }
  );

  function onDrop(inputOffset: THREE.Vector2, asset: AssetMetadata) {
    if (onHover.cancel) {
      onHover.cancel();
    }

    setDragSource(undefined);

    const { current: contextInstance } = context;
    const { current: groundPlaneInstance } = groundPlane;

    if (!contextInstance || !groundPlaneInstance) {
      return;
    }

    const { raycaster } = contextInstance;
    const { current: size } = bounds;

    if (!size) {
      return;
    }

    const ndc = new THREE.Vector2();

    ndc.x = ((inputOffset.x - size.left) / size.width) * 2 - 1;
    ndc.y = -((inputOffset.y - size.top) / size.height) * 2 + 1;

    raycaster.setFromCamera(ndc, contextInstance.camera);

    const [hitPlane] = raycaster.intersectObject(groundPlaneInstance);

    if (!hitPlane) {
      return;
    }

    const id = nextId.current++;

    setDroppedAssets(assets => [...assets, {
      asset,
      id,
      position: hitPlane.point
    }]);
  }

  function connectContext(instance: CanvasContext) {
    context.current = instance;

    if (instance.gl) {
      instance.gl.shadowMap.enabled = true;
      instance.gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }


    setCreated(true);
  }

  const [drop] = useAssetItemDrop(canDrop, onHover, onDrop);

  const connectContainer = throttle((container: HTMLDivElement) => {
    if (drop) {
      drop(container);
    }

    if (container) {
      bounds.current = container.getBoundingClientRect();
    }
  });

  return (
    <div ref={connectContainer} style={{ width: "100%", height: "100%" }}>
      <Canvas onCreated={connectContext}>
        <ZoneEditorCamera />
        <EditorEnvironment plane={ref => (groundPlane.current = ref)} />
        <Debug />
        <ZoneObjects objects={droppedAssets} />
        {dragSource && (
          <DraggedAssetPreview position={dragSource.targetLocation} />
        )}
      </Canvas>
    </div>
  );
}
