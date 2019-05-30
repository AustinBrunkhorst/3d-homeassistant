import React from "react";
import styled from "styled-components";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from "@material-ui/core";
import {
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DragPreviewImage
} from "react-dnd";

const PropThumbnail = styled(Avatar)`
  border-radius: 0 !important;

  img {
    object-fit: contain;
  }
`;

function PropListItem({
  prop: { title, thumbnail },
  connectDragSource,
  connectDragPreview
}) {
  return (
    <>
      <DragPreviewImage connect={connectDragPreview} src={thumbnail} />
      <ListItem key={title} ref={connectDragSource}>
        <ListItemAvatar>
          <PropThumbnail src={thumbnail} />
        </ListItemAvatar>
        <ListItemText primary={title} />
      </ListItem>
    </>
  );
}

export default DragSource(
  "propListItem",
  {
    beginDrag: () => ({})
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(PropListItem);
