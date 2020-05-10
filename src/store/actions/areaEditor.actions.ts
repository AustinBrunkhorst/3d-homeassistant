import { createAsyncAction, createStandardAction } from "typesafe-actions";
import {
    LightObject, Quaternion, SceneObject, Transform, Vector3,
} from "../models/areaEditor.model";

export const loadArea = createAsyncAction(
  "areaEditor/LOAD_AREA",
  "areaEditor/LOAD_AREA_SUCCESS",
  "areaEditor/LOAD_AREA_FAILURE",
)<string, SceneObject[], Error>();

export const addObject = createStandardAction("areaEditor/ADD_OBJECT")<SceneObject>();

export const setIsSelectionDisabled = createStandardAction("areaEditor/SET_SELECTION_DISABLED")<boolean>();

export const selectObject = createStandardAction("areaEditor/SELECT_OBJECT")<{
  id: number;
  clearSelection?: boolean;
}>();

export const deselectAllObjects = createStandardAction("areaEditor/DESELECT_ALL_OBJECTS")();

export const updateObjectTransform = createStandardAction("areaEditor/UPDATE_OBJECT_TRANSFORM")<{
  id: number;
  transform: Transform;
}>();

export const updateObjectPosition = createStandardAction("areaEditor/UPDATE_OBJECT_POSITION")<{
  id: number;
  position: Vector3;
}>();

export const updateObjectScale = createStandardAction("areaEditor/UPDATE_OBJECT_SCALE")<{
  id: number;
  scale: Vector3;
}>();

export const updateObjectRotation = createStandardAction("areaEditor/UPDATE_OBJECT_ROTATION")<{
  id: number;
  rotation: Quaternion;
}>();

export const updateLight = createStandardAction("areaEditor/UPDATE_LIGHT")<{
  id: number;
  light: Partial<LightObject>;
}>();

export const deleteObject = createStandardAction("areaEditor/DELETE_OBJECT")<number>();

export const undo = createStandardAction("areaEditor/UNDO")<void>();
export const redo = createStandardAction("areaEditor/REDO")<void>(); 
