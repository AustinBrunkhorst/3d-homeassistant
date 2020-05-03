import { Box, ListItem, ListItemText } from "@material-ui/core";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import * as actions from "store/actions/areaEditor.actions";
import { SceneObject } from "store/models/areaEditor.model";
import { selectObjects, selectSelectedObjectIds } from "store/selectors/areaEditor.selector";
import { AssetThumbnail } from "./elements";

const Container = styled.div`
  flex: 1;
  overflow: hidden;
`;

export function ObjectList() {
  const dispatch = useDispatch();
  const objects = useSelector(selectObjects);
  const selectedObjects = useSelector(selectSelectedObjectIds);

  const selectObject = useCallback(({ id }: SceneObject) => {
    dispatch(actions.selectObject({ id }));
  }, [dispatch]);
  
  return (
    <Container>
      {objects.map(object => (
        <ListItem key={object.id} selected={selectedObjects.includes(object.id)} onClick={() => selectObject(object)} button>
          <Box mr={2}>
            {
              object.type === 'model'
                ? <AssetThumbnail src={object.model.thumbnail} />
                : <WbIncandescentIcon />
            }
          </Box>
          <ListItemText primary={object.type === 'model' ? object.model.title : object.entityId} />
        </ListItem>
      ))}
    </Container>
  );
}