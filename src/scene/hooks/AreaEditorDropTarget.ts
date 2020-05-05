import throttle from "raf-schd";
import { useCallback, useRef } from "react";
import { DragObjectWithType, DropTargetMonitor, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { CanvasContext } from "react-three-fiber";
import { Mesh, Quaternion, Vector2, Vector3 } from "three";
import { AssetItemDragType } from "core/dragDrop/types";
import * as actions from "store/actions";
import { SceneObject } from "store/models/areaEditor.model";
import { snap } from "util/Vector";
import { getGroundObject } from "../ZoneEditorObjects";

interface SceneObjectDragItem extends DragObjectWithType {
  object: SceneObject;
}

interface DragState {
  object: SceneObject;
  position: Vector3;
}

const dropSnapSize = 0.05;

export default function useAreaEditorDropTarget(generateId: () => number) {
  const dispatch = useDispatch();
  const viewport = useRef<DOMRect>();
  const context = useRef<any>();
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
    { object }: SceneObjectDragItem,
    monitor: DropTargetMonitor
  ) {
    const input = monitor.getClientOffset();

    if (!input) {
      return;
    }

    const position = screenToDropPosition(input);

    if (position) {
      dragState.current = { object, position };
    } else {
      dragState.current = undefined;
    }
  });

  const [, connectDropTarget] = useDrop({
    accept: AssetItemDragType,
    canDrop(_: SceneObjectDragItem, monitor: DropTargetMonitor) {
      const input = monitor.getClientOffset();
      
      if (!input) {
        return false;
      }

      const position = screenToDropPosition(input);

      return position !== null;
    },
    hover,
    drop({ object }: SceneObjectDragItem, monitor: DropTargetMonitor) {
      if (hover.cancel) {
        hover.cancel();
      }

      const input = monitor.getClientOffset();

      if (!input || !monitor.canDrop()) {
        return;
      }

      const position = screenToDropPosition(input);
      const rotation = new Quaternion();
      const scale = new Vector3(1, 1, 1);

      if (position === null) {
        return;
      }

      dragState.current = undefined;

      const id = generateId();

      dispatch(
        actions.addObject({
          ...object,
          id,
          transform: {
            position: { x: position.x, y: position.y, z: position.z },
            rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w },
            scale: { x: scale.x, y: scale.y, z: scale.z },
          }
        })
      );
    }
  });

  const setContext = useCallback((instance: CanvasContext) => {
    console.log('set context', instance);
    context.current = instance;

    const { gl, scene } = context.current;

    if (!gl || !gl.domElement || !scene) {
      return;
    }

    // TODO: this is hacky - figure out why DragDropContext is null inside Canvas
    ground.current = getGroundObject(scene);

    // TODO: fix this
    setTimeout(() => {
      viewport.current = gl.domElement.getBoundingClientRect();

      connectDropTarget(gl.domElement);
    });
  }, [connectDropTarget]);

  return { dragState, setContext, context };
}
