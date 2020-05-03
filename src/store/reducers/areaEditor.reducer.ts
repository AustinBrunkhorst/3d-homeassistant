import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import produce from "immer";
import undoable, { groupByActionTypes } from "redux-undo";
import { ActionType, createReducer, getType, isActionOf } from "typesafe-actions";
import { ModelObject } from "store/models/areaEditor.model";
import * as actions from "../actions/areaEditor.actions";
import { LightObject } from "../models/areaEditor.model";

export type Actions = ActionType<typeof actions>;

export interface AreaEditorState {
  areaId: string;
  models: EntityState<ModelObject>;
  lights: EntityState<LightObject>;
}

const modelAdapter = createEntityAdapter<ModelObject>({});
const lightAdapter = createEntityAdapter<LightObject>({});

export const initialState: AreaEditorState = {
  areaId: "",
  models: modelAdapter.getInitialState(),
  lights: lightAdapter.getInitialState(),
};

const reducer = createReducer(initialState)
  .handleAction(actions.loadArea.request, (state, { payload: areaId }) =>
    produce(state, draft => {
      draft.areaId = areaId;
    })
  )
  .handleAction(actions.loadArea.success, (state, { payload: { models, lights } }) =>
    produce(state, draft => {
      draft.models = modelAdapter.addMany(state.models, models);
      draft.lights = lightAdapter.addMany(state.lights, lights);
    })
  )
  .handleAction(actions.addModel, (state, { payload: { id, asset, position, rotation, scale } }) =>
    produce(state, draft => {
      // TODO: add clear selection option
      for (const object of draft.models) {
        object.selected = false;
      }

      draft.models.push({
        id,
        asset,
        position,
        rotation,
        scale,
        selected: true
      });
    })
  )
  .handleAction(actions.selectObject, (state, { payload: { instanceId } }) =>
    produce(state, draft => {
      for (const object of draft.models) {
        object.selected = object.id === instanceId;
      }
    })
  )
  .handleAction(actions.deselectAllObjects, (state) =>
    produce(state, draft => {
      for (const object of draft.models) {
        object.selected = false;
      }
    })
  )
  .handleAction(actions.updateObjectTransform, (state, { payload: { instanceId, position, rotation, scale } }) =>
    produce(state, draft => {
      for (const object of draft.models) {
        if (object.id !== instanceId) {
          continue;
        }

        object.transform.position = { x: position.x, y: position.y, z: position.z };
        object.transform.rotation = { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w };
        object.transform.scale = { x: scale.x, y: scale.y, z: scale.z };

        break;
      }
    })
  )
  .handleAction(actions.deleteObject, (state, { payload: instanceId }) =>
    produce(state, draft => {
      draft.models = draft.models.filter(object => object.id !== instanceId);
    })
  );

export default undoable(reducer, {
  undoType: getType(actions.undo),
  redoType: getType(actions.redo),
  filter: isActionOf([
    actions.addModel,
    actions.selectObject,
    actions.updateObjectTransform,
    actions.deselectAllObjects,
    actions.deleteObject
  ]),
  groupBy: groupByActionTypes(getType(actions.selectObject))
});
