import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { HassEntity } from "home-assistant-js-websocket";
import React from "react";
import { DragSource, DragSourceConnector, DragSourceMonitor } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { AssetItemDragType } from "core/dragDrop/types";
import { LightObject } from "store/models/areaEditor.model";

export interface AssetListItemProps {
  light: HassEntity;
}

function LightListItem({
  light: { entity_id },
  connectDragSource,
  connectDragPreview
}) {
  connectDragPreview(getEmptyImage());

  return (
    <ListItem ref={connectDragSource}>
      <ListItemText primary={entity_id.substr('light.'.length)} />
    </ListItem>
  );
}

export default DragSource(
  AssetItemDragType,
  {
    beginDrag: ({ light }: AssetListItemProps) => ({
      object: { type: 'light', entityId: light.entity_id, intensity: 1, distance: 1, decay: 1 } as Partial<LightObject>
    })
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(LightListItem);
