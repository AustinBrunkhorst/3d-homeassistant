import throttle from 'raf-schd';
import React, { useMemo, useReducer, useRef, useState } from 'react';
import { Canvas, extend, useResource, useThree } from 'react-three-fiber';
import { CanvasContext } from 'react-three-fiber/types/src/canvas';
import { PCFSoftShadowMap, Vector2, Vector3 } from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { AxesHelper } from 'three/src/helpers/AxesHelper';
import { GridHelper } from 'three/src/helpers/GridHelper';

import { useAssetItemDrop } from 'core/dragDrop/assetItem';
import TransformControls from 'lib/three/TransformControls';
import { AssetMetadata } from 'store/asset.models';
import * as actions from 'store/zoneEditor.actions';
import reducer, { initialState } from 'store/zoneEditor.reducer';
import { snap } from 'util/Vector';
import AssetModel from './AssetModel';
import DebugStats from './DebugStats';
import EditorEnvironment from './EditorEnvironment';
import MapControlsCamera from './MapControlsCamera';

extend({ AxesHelper, GridHelper, MapControls, TransformControls });

interface DragState {
  asset: AssetMetadata;
  position: Vector3;
}

export default function ZoneEditorScene() {
  const { camera, raycaster, gl } = useThree();
  const bounds = useRef<any>();
  const [connectGroundPlane, groundPlane] = useResource();
  const [dragSource, setDragSource] = useState<DragState>();
  const nextId = useRef(0);
  const gridSnapSize = 0.1;

  const [{ droppedAssets }, dispatch] = useReducer(reducer, initialState);

  function raycastEditorPlane(screen: Vector2) {
    if (!groundPlane || !bounds.current) {
      return null;
    }

    const { left, top, width, height } = bounds.current;
    const { x, y } = screen;

    const ndc = new Vector2();

    ndc.x = ((x - left) / width) * 2 - 1;
    ndc.y = -((y - top) / height) * 2 + 1;

    raycaster.setFromCamera(ndc, camera);

    const [hit] = raycaster.intersectObject(groundPlane);

    return hit ? hit.point : null;
  }

  const canDrop = (screen: Vector2) => raycastEditorPlane(screen) !== null;

  function onHover(screen: Vector2, asset: AssetMetadata) {
    const planeWorldPosition = raycastEditorPlane(screen);

    if (planeWorldPosition) {
      const { x, y, z } = planeWorldPosition;

      const snapSize = 0.1;

      const position = new Vector3(
        Math.round(x / snapSize) * snapSize,
        y,
        Math.round(z / snapSize) * snapSize
      );

      setDragSource({ asset, position });
    } else {
      setDragSource(undefined);
    }
  }

  function onDrop(screen: Vector2, asset: AssetMetadata) {
    const planeWorldPosition = raycastEditorPlane(screen);

    if (planeWorldPosition) {
      const id = nextId.current++;

      const position = snap(planeWorldPosition, gridSnapSize);

      dispatch(actions.dropAsset({
        id, asset, position
      }));
    }
  }

  function connectContext(instance: CanvasContext) {
    if (instance.gl) {
      // TODO:
      instance.gl.shadowMap.enabled = false;
      instance.gl.shadowMap.type = PCFSoftShadowMap;
    }
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
            asset={asset}
            position={new Vector3(x, y, z)}
          />
          {selected && <transformControls args={[]} />}
        </>
      )
    );
  }, [droppedAssets]);

  console.log('render');

  return (
    <div
      ref={connectContainer}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Canvas onCreated={connectContext}>
        <MapControlsCamera name="camera.zoneEditor" />
        <EditorEnvironment plane={connectGroundPlane} />
        {droppedObjects}
        {dragSource && (
          <AssetModel
            asset={dragSource.asset}
            position={dragSource.position}
          />
        )}
      </Canvas>
      {gl && <DebugStats gl={gl} />}
    </div>
  );
}
