import * as THREE from "three";
import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { LightObject, Model, ModelObject } from "../models/areaEditor.model";

export const loadArea = createAsyncAction(
  "areaEditor/LOAD_AREA",
  "areaEditor/LOAD_AREA_SUCCESS",
  "areaEditor/LOAD_AREA_FAILURE",
)<string, { models: ModelObject[], lights: LightObject[] }, Error>();

export const addModel = createStandardAction("areaEditor/DROP_MODEL_ASSET")<{
  id: number;
  asset: Model;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  scale: THREE.Vector3;
}>();

export const selectObject = createStandardAction("areaEditor/SELECT_OBJECT")<{
  instanceId: number;
  clearSelection?: boolean;
}>();

export const deselectAllObjects = createStandardAction("areaEditor/DESELECT_ALL_OBJECTS")();

export const updateObjectTransform = createStandardAction("areaEditor/UPDATE_OBJECT_TRANSFORM")<{
  instanceId: number;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  scale: THREE.Vector3;
}>();

export const deleteObject = createStandardAction("areaEditor/DELETE_OBJECT")<number>();

export const undo = createStandardAction("areaEditor/UNDO")<void>();
export const redo = createStandardAction("areaEditor/REDO")<void>(); 
