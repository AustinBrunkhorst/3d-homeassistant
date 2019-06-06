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
import ZoneObjects from "./ZoneObjects";

extend({ AxesHelper, GridHelper, MapControls });

function EditorEnvironment({ plane }) {
  const [sunProps, setSunProps] = useState({
    distance: 400000,
    turbidity: 5,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1.15,
    elevation: 1,
    azimuth: 1
  });

  const sunPosition = useRef(new THREE.Vector3());

  useRender(() => {
    const normalized = THREE.Math.mapLinear(
      (Math.cos(Date.now() / 50000) + 1) * 0.5,
      0,
      1,
      0.15,
      0.35
    );

    setSunProps({
      ...sunProps,
      azimuth: normalized,
      elevation: normalized
    });
  });

  return (
    <>
      <ambientLight color="white" intensity={0.5} />
      <directionalLight position={sunPosition.current.clone()} castShadow />
      <gridHelper
        args={[10, 50, new THREE.Color("#4b968f"), new THREE.Color("#5eb2aa")]}
      />
      <mesh
        ref={plane}
        rotation={[-THREE.Math.degToRad(90), 0, THREE.Math.degToRad(90)]}
      >
        <planeGeometry attach="geometry" args={[10, 10]} />
        <meshBasicMaterial attach="material" color="#6cdcd1" />
      </mesh>

      <Skybox
        {...sunProps}
        updateSunPosition={value => (sunPosition.current = value)}
      />
    </>
  );
}

function Debug() {
  return <axesHelper args={[4]} position={[-40, 0, -40]} />;
}

interface DragState {
  asset: AssetMetadata;
  position: THREE.Vector3;
}

interface DroppedAsset {
  id: number;
  asset: AssetMetadata;
  position: THREE.Vector3;
}

const initialItems = [];

export default function ZoneEditorScene() {
  const [, setCreated] = useState(false);
  const context = useRef<CanvasContext>();
  const groundPlane = useRef<THREE.Mesh>();
  const bounds = useRef<any>();
  const [dragSource, setDragSource] = useState<DragState>();
  const [droppedAssets, setDroppedAssets] = useState<DroppedAsset[]>(
    initialItems
  );
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

      const [hitPlane] = raycaster.intersectObject(groundPlaneInstance);

      if (hitPlane) {
        const snapSize = 0.1;
        const position = new THREE.Vector3(
          Math.round(hitPlane.point.x / snapSize) * snapSize,
          hitPlane.point.y,
          Math.round(hitPlane.point.z / snapSize) * snapSize
        );

        setDragSource({ asset, position });
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

    const snapSize = 0.1;
    const position = new THREE.Vector3(
      Math.round(hitPlane.point.x / snapSize) * snapSize,
      hitPlane.point.y,
      Math.round(hitPlane.point.z / snapSize) * snapSize
    );

    setDroppedAssets(assets => [
      ...assets,
      {
        asset,
        id,
        position
      }
    ]);
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
        <ZoneObjects objects={droppedAssets} dragSource={dragSource} />
      </Canvas>
    </div>
  );
}
