import { Box, List, ListItem, ListItemText, ListSubheader, TextField } from "@material-ui/core";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Euler, MathUtils, Quaternion } from "three";
import * as actions from "store/actions/areaEditor.actions";
import { selectSelectedObjects } from "store/selectors/areaEditor.selector";
import { AssetThumbnail } from "./elements";

const Container = styled.div`
  flex: 1;
  overflow: hidden;
  max-width: 350px;
`;

export function ObjectInspector() {
  const dispatch = useDispatch();
  const [selectedObject] = useSelector(selectSelectedObjects);

  if (!selectedObject) {
    return <Container>Select an object</Container>;
  }

  const { transform: { position, rotation: quat, scale } } = selectedObject;

  const rotation = new Euler().setFromQuaternion(new Quaternion(quat.x, quat.y, quat.z, quat.w));

  const updatePosition = (x: number | null, y: number | null, z: number | null) => {
    const newPosition = { x: position.x, y: position.y, z: position.z };

    if (x !== null) {
      newPosition.x = x;
    }

    if (y !== null) {
      newPosition.y = y;
    }

    if (z !== null) {
      newPosition.z = z;
    }

    dispatch(actions.updateObjectTransform({
      id: selectedObject.id,
      transform: {
        position: newPosition,
        rotation: quat,
        scale
      }
    }))
  };

  const updateScale = (x: number | null, y: number | null, z: number | null) => {
    const newScale = { x: scale.x, y: scale.y, z: scale.z };

    if (x !== null) {
      newScale.x = x;
    }

    if (y !== null) {
      newScale.y = y;
    }

    if (z !== null) {
      newScale.z = z;
    }

    dispatch(actions.updateObjectTransform({
      id: selectedObject.id,
      transform: {
        position,
        rotation: quat,
        scale: newScale
      }
    }))
  };

  const updateRotation = (x: number | null, y: number | null, z: number | null) => {
    const newRotation = new Euler(
      x === null ? rotation.x : MathUtils.degToRad(x),
      y === null ? rotation.y : MathUtils.degToRad(y),
      z === null ? rotation.z : MathUtils.degToRad(z),
    );

    const quat = new Quaternion().setFromEuler(newRotation);

    dispatch(actions.updateObjectTransform({
      id: selectedObject.id,
      transform: {
        position,
        rotation: { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
        scale
      }
    }))
  };
  
  return (
    <Container>
      <List subheader={<li />}>
        <ListItem>
          <Box mr={2}>
            {
              selectedObject.type === 'model'
                ? <AssetThumbnail src={selectedObject.model.thumbnail} />
                : <WbIncandescentIcon />
            }
          </Box>
          <ListItemText primary={selectedObject.type === 'model' ? selectedObject.model.title : selectedObject.entityId} />
        </ListItem>
        <ListSubheader>Translation</ListSubheader>
        <ListItem dense>
          <TextField type="number" label="x" color="secondary" value={position.x} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePosition(e.target.valueAsNumber, null, null)} />
          <TextField type="number" label="y" color="secondary" value={position.y} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePosition(null, e.target.valueAsNumber, null)} />
          <TextField type="number" label="z" color="secondary" value={position.z} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePosition(null, null, e.target.valueAsNumber)} />
        </ListItem>
        <ListSubheader>Scale</ListSubheader>
        <ListItem dense>
          <TextField type="number" label="x" color="secondary" value={scale.x} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScale(e.target.valueAsNumber, null, null)} />
          <TextField type="number" label="y" color="secondary" value={scale.y} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScale(null, e.target.valueAsNumber, null)} />
          <TextField type="number" label="z" color="secondary" value={scale.z} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScale(null, null, e.target.valueAsNumber)} />
        </ListItem>
        <ListSubheader>Rotation</ListSubheader>
        <ListItem dense>
          <TextField type="number" label="x" color="secondary" value={MathUtils.radToDeg(rotation.x)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRotation(e.target.valueAsNumber, null, null)} />
          <TextField type="number" label="y" color="secondary" value={MathUtils.radToDeg(rotation.y)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRotation(null, e.target.valueAsNumber, null)} />
          <TextField type="number" label="z" color="secondary" value={MathUtils.radToDeg(rotation.z)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRotation(null, null, e.target.valueAsNumber)} />
        </ListItem>
      </List>
    </Container>
  );
}