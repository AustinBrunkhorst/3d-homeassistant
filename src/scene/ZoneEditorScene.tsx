import throttle from 'raf-schd';
import React, { useMemo, useReducer, useRef, useState } from 'react';
import { Canvas, extend } from 'react-three-fiber';
import { CanvasContext } from 'react-three-fiber/types/src/canvas';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/js/controls/TransformControls';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { AxesHelper } from 'three/src/helpers/AxesHelper';
import { GridHelper } from 'three/src/helpers/GridHelper';

import { useAssetItemDrop } from 'core/dragDrop/assetItem';
import { AssetMetadata, DroppedAsset } from 'store/asset.models';
import * as actions from 'store/zoneEditor.actions';
import reducer, { initialState } from 'store/zoneEditor.reducer';
import AssetModel from './AssetModel';
import DebugStats from './DebugStats';
import EditorEnvironment from './EditorEnvironment';
import MapControlsCamera from './MapControlsCamera';

extend({ AxesHelper, GridHelper, MapControls, TransformControls });

interface DragState {
  asset: AssetMetadata;
  position: THREE.Vector3;
}

export default function ZoneEditorScene() {
  const [, setCreated] = useState(false);
  const context = useRef<CanvasContext>();
  const groundPlane = useRef<THREE.Mesh>();
  const bounds = useRef<any>();
  const [dragSource, setDragSource] = useState<DragState>();
  const nextId = useRef(0);

  const [{ droppedAssets }, dispatch] = useReducer(reducer, initialState);

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

    dispatch(actions.dropAsset({ id, asset, position }));
  }

  function connectContext(instance: CanvasContext) {
    context.current = instance;

    if (instance.gl) {
      // TODO:
      instance.gl.shadowMap.enabled = false;
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

  const droppedObjects = useMemo(() => {
    return droppedAssets.map(
      ({ asset, id, selected, position: { x, y, z } }) => (
        <>
          <AssetModel
            key={id}
            instanceId={id}
            asset={asset}
            position={new THREE.Vector3(x, y, z)}
            dispatch={dispatch}
          />
          {selected && <transformControls />}
        </>
      )
    );
  }, [droppedAssets]);

  return (
    <div
      ref={connectContainer}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Canvas onCreated={connectContext}>
        <MapControlsCamera />
        <EditorEnvironment plane={self => (groundPlane.current = self)} />
        {droppedObjects}
        {dragSource && (
          <AssetModel
            instanceId={-1}
            asset={dragSource.asset}
            position={dragSource.position}
            dispatch={dispatch}
          />
        )}
      </Canvas>
      <DebugStats context={context} />
    </div>
  );
}
