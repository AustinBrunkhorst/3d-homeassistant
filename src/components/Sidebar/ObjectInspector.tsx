import { Box, List, ListItem, ListItemText, ListSubheader, TextField } from "@material-ui/core";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Euler, MathUtils, Quaternion } from "three";
import * as actions from "store/actions/areaEditor.actions";
import { LightObject, SceneObject } from "store/models/areaEditor.model";
import { selectSelectedObjects } from "store/selectors/areaEditor.selector";
import { AssetThumbnail } from "./elements";

const Container = styled.div`
  flex: 1;
  overflow: hidden;
  max-width: 350px;
`;

export function ObjectInspector() {
  const [selectedObject] = useSelector(selectSelectedObjects);

  if (!selectedObject) {
    return <Container>Select an object</Container>;
  }
  
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
        <TransformInspector object={selectedObject} />
        {selectedObject.type === 'light' && <LightInspector object={selectedObject} />}
      </List>
    </Container>
  );
}

interface InspectorProps {
  object: SceneObject;
}

const TransformInspector = ({ object }: InspectorProps) => {
  const dispatch = useDispatch();
  
  const { position, rotation: quat, scale } = object.transform;

  const rotation = useMemo(() => new Euler().setFromQuaternion(new Quaternion(quat.x, quat.y, quat.z, quat.w)), [quat]);

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
      id: object.id,
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
      id: object.id,
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
      id: object.id,
      transform: {
        position,
        rotation: { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
        scale
      }
    }))
  };

  return (
    <>
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
    </>
  );
};

const LightInspector = ({ object }: InspectorProps) => {
  const dispatch = useDispatch();
  const light = object as LightObject;

  const updateIntensity = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.updateLight({ id: object.id, light: { intensity: e.target.valueAsNumber }}));
  }, [dispatch, object.id]);

  const updateDistance = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.updateLight({ id: object.id, light: { distance: e.target.valueAsNumber }}));
  }, [dispatch, object.id]);

  const updateDecay = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.updateLight({ id: object.id, light: { decay: e.target.valueAsNumber }}));
  }, [dispatch, object.id]);

  return (
    <>
      <ListSubheader>Light</ListSubheader>
      <ListItem dense>
        <TextField fullWidth type="number" label="Intensity" color="secondary" value={light.intensity} onChange={updateIntensity} />
      </ListItem>
      <ListItem dense>
        <TextField fullWidth type="number" label="Distance" color="secondary" value={light.distance} onChange={updateDistance} />
      </ListItem>
      <ListItem dense>
        <TextField fullWidth type="number" label="Decay" color="secondary" value={light.decay} onChange={updateDecay} />
      </ListItem>
    </>
  );
}