import throttle from 'raf-schd';
import { useContext, useLayoutEffect, useRef } from 'react';
import {
    __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd, DragObjectWithType,
    DropTargetMonitor
} from 'react-dnd';
import { Mesh, Vector2, Vector3 } from 'three';

import { AssetItemDragType } from 'core/dragDrop/types';
import { ZoneEditorContext } from 'scene/ZoneEditorContext';
import { AssetMetadata } from 'store/asset.models';
import * as actions from 'store/zoneEditor.actions';
import { snap } from 'util/Vector';

const { useDrop } = dnd;

interface AssetDragItem extends DragObjectWithType {
  asset: AssetMetadata;
}

interface DragState {
  asset: AssetMetadata;
  position: Vector3;
}

const dropSnapSize = 0.05;

export default function useZoneEditorDropTarget(dispatch: Function) {
  const viewport = useRef<DOMRect>();
  const context = useRef<any>();
  const nextId = useRef(0);

  const ground = useRef<Mesh>();

  const dragState = useRef<DragState>();

  function screenToDropPosition({ x, y }) {
    if (!ground.current || !viewport.current || !context.current) {
      return null;
    }

    const { left, top, width, height } = viewport.current;
    const { camera, raycaster } = context.current;

    const ndc = new Vector2();

    ndc.x = ((x - left) / width) * 2 - 1;
    ndc.y = -((y - top) / height) * 2 + 1;

    raycaster.setFromCamera(ndc, camera);

    const [hit] = raycaster.intersectObject(ground.current);

    return hit ? snap(hit.point, dropSnapSize) : null;
  }

  const hover = throttle(function onHover(
    { asset }: AssetDragItem,
    monitor: DropTargetMonitor
  ) {
    const input = monitor.getClientOffset();

    if (!input) {
      return;
    }

    const position = screenToDropPosition(input);

    if (position) {
      dragState.current = { asset, position };
    } else {
      dragState.current = undefined;
    }
  });

  const [, connectDropTarget] = useDrop({
    accept: AssetItemDragType,
    canDrop(_: AssetDragItem, monitor: DropTargetMonitor) {
      const input = monitor.getClientOffset();

      if (!input) {
        return false;
      }

      const position = screenToDropPosition(input);

      return position !== null;
    },
    hover,
    drop({ asset }: AssetDragItem, monitor: DropTargetMonitor) {
      if (hover.cancel) {
        hover.cancel();
      }

      const input = monitor.getClientOffset();

      if (!input || !monitor.canDrop()) {
        return;
      }

      const position = screenToDropPosition(input);

      if (position === null) {
        return;
      }

      dragState.current = undefined;

      const id = nextId.current++;

      dispatch(
        actions.dropAsset({
          id,
          asset,
          position
        })
      );
    }
  });

  useLayoutEffect(() => {
    const { current: instance } = context;

    if (!instance) {
      return;
    }

    const { canvas, scene } = instance;

    if (!canvas || !scene) {
      return;
    }

    const groundObjectName = "ground";

    // TODO: this is hacky - figure out why DragDropContext is null inside Canvas
    ground.current = scene.getObjectByName(groundObjectName) as Mesh;

    if (!ground.current) {
      throw new Error(
        `useZoneEditorDropTarget() expected an object in the scene with name "${groundObjectName}"`
      );
    }

    viewport.current = canvas.getBoundingClientRect() as DOMRect;

    connectDropTarget(canvas);
  }, [context.current, connectDropTarget]);

  return [dragState, context];
}
