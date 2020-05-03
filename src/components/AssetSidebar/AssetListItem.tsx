import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { DragSource, DragSourceConnector, DragSourceMonitor } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { AssetItemDragType } from "core/dragDrop/types";
import { Model } from "store/models/areaEditor.model";
import { AssetThumbnail } from "./elements";

export interface AssetListItemProps {
  asset: Model;
}

function AssetListItem({
  asset: { title, thumbnail },
  connectDragSource,
  connectDragPreview
}) {
  connectDragPreview(getEmptyImage());

  return (
    <ListItem key={title} ref={connectDragSource}>
      <Box mr={2}>
        <AssetThumbnail src={thumbnail} />
      </Box>
      <ListItemText primary={title} />
    </ListItem>
  );
}

export default DragSource(
  AssetItemDragType,
  {
    beginDrag: ({ asset }: AssetListItemProps) => ({ asset })
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(AssetListItem);
