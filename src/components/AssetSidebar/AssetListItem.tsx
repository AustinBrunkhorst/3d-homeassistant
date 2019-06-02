import React from "react";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DragPreviewImage
} from "react-dnd";

import { AssetMetadata } from "../../store/asset.model";
import { AssetThumbnail } from "./elements";

export interface AssetListItemProps {
  asset: AssetMetadata;
}

function AssetListItem({
  asset: { title, thumbnail },
  connectDragSource,
  connectDragPreview
}) {
  return (
    <>
      <DragPreviewImage connect={connectDragPreview} src={thumbnail} />
      <ListItem key={title} ref={connectDragSource}>
        <Box mr={2}>
          <AssetThumbnail src={thumbnail} />
        </Box>
        <ListItemText primary={title} />
      </ListItem>
    </>
  );
}

export const AssetListItemDragType = Symbol();

export default DragSource(
  AssetListItemDragType,
  {
    beginDrag: () => ({})
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(AssetListItem);
