import throttle from "raf-schd";
import { useCallback, useRef } from "react";
import { DragObjectWithType, DropTargetMonitor, useDrop } from "react-dnd";
import { CanvasContext } from "react-three-fiber";
import { Mesh, Vector2, Vector3 } from "three";
import { AssetItemDragType } from "core/dragDrop/types";
import { AssetMetadata } from "store/asset.models";
import * as actions from "store/zoneEditor.actions";
import { snap } from "util/Vector";
import { getGroundObject } from "../ZoneEditorObjects";

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

    //test

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

  const setContext = useCallback((instance: CanvasContext) => {
    context.current = instance;

    const { canvas, scene } = context.current;

    if (!canvas || !scene) {
      return;
    }

    // TODO: this is hacky - figure out why DragDropContext is null inside Canvas
    ground.current = getGroundObject(scene);

    // TODO: fix this
    setTimeout(() => {
      viewport.current = canvas.getBoundingClientRect();

      connectDropTarget(canvas);
    });
  }, [connectDropTarget]);

  return { dragState, setContext, context };
}
