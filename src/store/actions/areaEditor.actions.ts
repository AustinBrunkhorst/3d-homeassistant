import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { LightObject, SceneObject, Transform } from "../models/areaEditor.model";

export const loadArea = createAsyncAction(
  "areaEditor/LOAD_AREA",
  "areaEditor/LOAD_AREA_SUCCESS",
  "areaEditor/LOAD_AREA_FAILURE",
)<string, SceneObject[], Error>();

export const addObject = createStandardAction("areaEditor/ADD_OBJECT")<SceneObject>();

export const selectObject = createStandardAction("areaEditor/SELECT_OBJECT")<{
  id: number;
  clearSelection?: boolean;
}>();

export const deselectAllObjects = createStandardAction("areaEditor/DESELECT_ALL_OBJECTS")();

export const updateObjectTransform = createStandardAction("areaEditor/UPDATE_OBJECT_TRANSFORM")<{
  id: number;
  transform: Transform;
}>();

export const updateLight = createStandardAction("areaEditor/UPDATE_LIGHT")<{
  id: number;
  light: Partial<LightObject>;
}>();

export const deleteObject = createStandardAction("areaEditor/DELETE_OBJECT")<number>();

export const undo = createStandardAction("areaEditor/UNDO")<void>();
export const redo = createStandardAction("areaEditor/REDO")<void>(); 
