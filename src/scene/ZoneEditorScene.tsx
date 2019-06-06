import * as THREE from "three";
import { AxesHelper } from "three/src/helpers/AxesHelper";
import { GridHelper } from "three/src/helpers/GridHelper";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import Sky from "three-sky";
import React, { useState, useRef } from "react";
import { extend, Canvas, useRender } from "react-three-fiber";
import { CanvasContext } from "react-three-fiber/types/src/canvas";
import throttle from "raf-schd";

import { useAssetItemDrop } from "core/dragDrop/assetItem";
import Sun from "./Sun";
import ZoneEditorCamera from "./ZoneEditorCamera";
import { AssetMetadata } from "store/asset.model";

extend({ AxesHelper, GridHelper, MapControls, Sky });

const FocusedObject = () => {
  const [rot, setRot] = useState(0);

  useRender(() => {
    setRot(Date.now() / 1000);
  });

  return (
    <mesh position={[10, 10, 0]} rotation={[rot, 0, rot]}>
      <dodecahedronBufferGeometry attach="geometry" args={[1, 0]} />
      <meshPhongMaterial attach="material" color="red" />
    </mesh>
  );
};

function EditorEnvironment({ plane }) {
  const [sunProps, setSunProps] = useState({
    distance: 1000,
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    elevation: 0.42,
    azimuth: 0.25
  });

  useRender(() => {
    setSunProps({
      ...sunProps,
      azimuth:
        (Math.cos(Date.now() / 900000) + 1) * 0.5 * THREE.Math.degToRad(270)
    });
  });

  return (
    <>
      <Sun {...sunProps} />
      <mesh
        ref={plane}
        rotation={[THREE.Math.degToRad(90), 0, THREE.Math.degToRad(90)]}
      >
        <planeGeometry attach="geometry" args={[40, 40]} />
        <meshBasicMaterial
          attach="material"
          color="#6cdcd1"
          side={THREE.DoubleSide}
        />
      </mesh>
      <gridHelper args={[10, 20]} />
    </>
  );
}

function Debug() {
  return <axesHelper args={[4]} position={[-10, 0, -10]} />;
}

interface DragState {
  asset: AssetMetadata;
  targetLocation: THREE.Vector3;
}

const dragPreviewSize = new THREE.Vector3(2, 2, 2);

function DragSourcePreview({ position }) {
  const offset = position.clone();

  offset.y += dragPreviewSize.y / 2;

  return (
    <mesh position={offset}>
      <boxBufferGeometry attach="geometry" args={dragPreviewSize.toArray()} />
      <meshPhongMaterial
        attach="material"
        color="green"
        emissive="green"
        emissiveIntensity={10}
      />
    </mesh>
  );
}

export default function ZoneEditorScene() {
  const [, setCreated] = useState(false);
  const context = useRef<CanvasContext>();
  const groundPlane = useRef<THREE.Mesh>();
  const bounds = useRef<any>();
  const [dragSource, setDragSource] = useState<DragState>();

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

  const onDrop = (inputOffset: THREE.Vector2, asset: AssetMetadata) => {
    console.log("drop");
    setDragSource(undefined);
  };

  function connectContext(instance: CanvasContext) {
    context.current = instance;

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
        <ambientLight color="gray" />
        <pointLight color="white" intensity={1} position={[0, 0, 10]} />
        <EditorEnvironment plane={ref => (groundPlane.current = ref)} />
        <FocusedObject />
        <Debug />
        {dragSource && (
          <DragSourcePreview position={dragSource.targetLocation} />
        )}
      </Canvas>
    </div>
  );
}
