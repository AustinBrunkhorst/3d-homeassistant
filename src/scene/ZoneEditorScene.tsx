import throttle from 'raf-schd';
import React, { useRef, useState } from 'react';
import { Canvas, extend, useRender } from 'react-three-fiber';
import { CanvasContext } from 'react-three-fiber/types/src/canvas';
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { AxesHelper } from 'three/src/helpers/AxesHelper';
import { GridHelper } from 'three/src/helpers/GridHelper';

import { useAssetItemDrop } from 'core/dragDrop/assetItem';
import { AssetMetadata } from 'store/asset.models';
import AssetModel from './AssetModel';
import ThreeDebugger from './ThreeDebugger';
import ZoneEditorCamera from './ZoneEditorCamera';
import EditorEnvironment from './ZoneEditorEnvironment';
import ZoneObjects from './ZoneObjects';

extend({ AxesHelper, GridHelper, MapControls });

interface DragState {
  asset: AssetMetadata;
  position: THREE.Vector3;
}

interface DroppedAsset {
  id: number;
  asset: AssetMetadata;
  position: THREE.Vector3;
}

export default function ZoneEditorScene() {
  const [, setCreated] = useState(false);
  const context = useRef<CanvasContext>();
  const groundPlane = useRef<THREE.Mesh>();
  const bounds = useRef<any>();
  const [dragSource, setDragSource] = useState<DragState>();
  const [droppedAssets, setDroppedAssets] = useState<DroppedAsset[]>([]);
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

  function onHover(inputOffset: THREE.Vector2, asset: AssetMetadata) {
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

  function onDrop(inputOffset: THREE.Vector2, asset: AssetMetadata) {
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
    <div
      ref={connectContainer}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Canvas onCreated={connectContext}>
        <MainScene
          groundPlane={groundPlane}
          droppedAssets={droppedAssets}
          dragSource={dragSource}
        />
      </Canvas>
      <ThreeDebugger context={context} />
    </div>
  );
}

const grid = {
  size: 10,
  divisions: 10,
  color: new THREE.Color("#5eb2aa"),
  axesColor: new THREE.Color("white")
};

function MainScene({ groundPlane, droppedAssets, dragSource }) {
  const scene = useRef();
  const camera = useRef<THREE.Camera>();

  useRender(({ gl }) => {
    gl.autoClear = true;

    if (scene.current && camera.current) {
      gl.render(scene.current, camera.current);
    }
  }, true);

  return (
    <scene ref={scene}>
      <ZoneEditorCamera connect={self => (camera.current = self)} />
      <EditorEnvironment plane={self => (groundPlane.current = self)} />
      <ZoneObjects objects={droppedAssets} />
      {dragSource && (
        <>
          <AssetModel asset={dragSource.asset} position={dragSource.position} />
          <gridHelper
            args={[grid.size, grid.divisions, grid.axesColor, grid.color]}
          />
        </>
      )}
    </scene>
  );
}

// function OrientationGizmo({}) {
//   const scene = useRef();
//   const camera = useRef<THREE.Camera>();

//   useRender(({ gl }) => {
//     gl.autoClear = true;

//     if (scene.current && camera.current) {
//       gl.render(scene.current, camera.current);
//     }
//   }, true);

//   return (
//     <scene ref={scene}>
//       <axesHelper args={[4]} position={[-40, 0, -40]} />
//     </scene>
//   );
// }
