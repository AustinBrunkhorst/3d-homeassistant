import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  ConnectDropTarget
} from "react-dnd";
import throttle from "raf-schd";
import { __EXPERIMENTAL_DND_HOOKS_THAT_MAY_CHANGE_AND_BREAK_MY_BUILD__ as dnd } from "react-dnd";

import { AssetItemDragType } from "./types";
import { AssetMetadata } from "store/asset.model";

const { useDrop } = dnd;

export interface DragProps {
  connectDropTarget: ConnectDropTarget;
}

export interface ZoneEditorDropHandler {
  dropTargetDidHover(monitor: DropTargetMonitor): void;
  dropTargetDidDrop(monitor: DropTargetMonitor): void;
}

export const withDropTarget = (component: React.ComponentType<DragProps>) =>
  DropTarget(AssetItemDragType, dropTarget, collect)(component);

const dropTarget = {
  hover: throttle(
    (
      props: DragProps,
      monitor: DropTargetMonitor,
      component: ZoneEditorDropHandler
    ) => {
      component.dropTargetDidHover(monitor);
    }
  ),

  drop(props, monitor, component: ZoneEditorDropHandler) {
    component.dropTargetDidDrop(monitor);
  }
};

const collect = (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget()
});

export function useAssetItemDrop() {
  const [collectedProps, drop] = useDrop({
    accept: AssetItemDragType,
    hover: throttle((item: AssetMetadata, monitor: DropTargetMonitor) => {
      console.log("hover", item);
    })
  });

  console.log("collected props", collectedProps);

  return [drop];
}
