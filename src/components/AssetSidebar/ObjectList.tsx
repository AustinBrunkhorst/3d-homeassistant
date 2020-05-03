import { Box, ListItem, ListItemText } from "@material-ui/core";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import * as actions from "store/actions/areaEditor.actions";
import { ModelObject } from "store/models/areaEditor.model";
import { selectObjects } from "store/selectors/areaEditor.selector";
import { AssetThumbnail } from "./elements";

const Container = styled.div`
  flex: 1;
  overflow: hidden;
`;

export function ObjectList() {
  const dispatch = useDispatch();
  const objects = useSelector(selectObjects);

  const selectObject = useCallback((object: ModelObject) => {
    dispatch(actions.selectObject({ instanceId: object.id }));
  }, [dispatch]);
  
  return (
    <Container>
      {objects.map(object => (
        <ListItem key={object.id} selected={object.selected} onClick={() => selectObject(object)} button>
          <Box mr={2}>
            <AssetThumbnail src={object.asset.thumbnail} />
          </Box>
          <ListItemText primary={object.asset.title} />
        </ListItem>
      ))}
    </Container>
  );
}