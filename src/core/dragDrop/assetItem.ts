import * as THREE from "three";
import { useRef } from "react";
import {
  DropTargetMonitor,
  DragObjectWithType,
  ConnectableElement
} from "react-dnd";
import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";

import { AssetItemDragType } from "./types";
import { AssetMetadata } from "store/asset.model";

const { useDrop } = dnd;

export interface AssetDragState {
  asset: AssetMetadata;

  // normalized device coordinates of the touch/cursor they item is currently dragged
  viewportNdc: THREE.Vector3;
}

export type CanDropHandler = (
  viewportOffset: THREE.Vector2,
  asset: AssetMetadata
) => boolean;

export type HoverHandler = (
  viewportOffset: THREE.Vector2,
  asset: AssetMetadata
) => void;

export type DropHandler = (
  viewportOffset: THREE.Vector2,
  asset: AssetMetadata
) => void;

interface AssetDragItem extends DragObjectWithType {
  asset: AssetMetadata;
}

export function useAssetItemDrop(
  canDrop: CanDropHandler,
  onHover: HoverHandler,
  onDrop: DropHandler
) {
  const container = useRef<HTMLElement>();

  const [, connectDropTarget] = useDrop({
    accept: AssetItemDragType,
    canDrop: ({ asset }: AssetDragItem, monitor: DropTargetMonitor) => {
      const input = monitor.getClientOffset();

      if (!container.current || !input || !canDrop) {
        return false;
      }

      return canDrop(new THREE.Vector2(input.x, input.y), asset);
    },
    hover: ({ asset }: AssetDragItem, monitor: DropTargetMonitor) => {
      const input = monitor.getClientOffset();

      if (!container.current || !input || !onHover) {
        return;
      }

      onHover(new THREE.Vector2(input.x, input.y), asset);
    },
    drop: ({ asset }: AssetDragItem, monitor: DropTargetMonitor) => {
      const input = monitor.getClientOffset();

      if (!container.current || !input || !onHover || !monitor.canDrop()) {
        return;
      }

      onDrop(new THREE.Vector2(input.x, input.y), asset);
    }
  });

  return [
    function connectContainer(instance: ConnectableElement) {
      connectDropTarget(instance);

      container.current = instance as HTMLElement;
    }
  ];
}
