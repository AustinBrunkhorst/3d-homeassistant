import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import produce from "immer";
import undoable, { groupByActionTypes } from "redux-undo";
import { ActionType, createReducer, getType, isActionOf } from "typesafe-actions";
import { SceneObject, Transform } from "store/models/areaEditor.model";
import * as actions from "../actions/areaEditor.actions";

export type Actions = ActionType<typeof actions>;

export interface AreaEditorState {
  areaId: string;
  objects: EntityState<SceneObject>;
  isSelectionDisabled: boolean;
  selectedObjects: number[];
}

const objectAdapter = createEntityAdapter<SceneObject>({});

export const selectors = objectAdapter.getSelectors();

export const initialState: AreaEditorState = {
  areaId: "",
  objects: objectAdapter.getInitialState(),
  isSelectionDisabled: false,
  selectedObjects: []
};

const reducer = createReducer(initialState)
  .handleAction(actions.loadArea.request, (state, { payload: areaId }) =>
    produce(state, draft => {
      draft.areaId = areaId;
    })
  )
  .handleAction(actions.loadArea.success, (state, { payload }) =>
    produce(state, draft => {
      draft.objects = objectAdapter.addMany(initialState.objects, payload);
    })
  )
  .handleAction(actions.addObject, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedObjects = [payload.id];
      draft.objects = objectAdapter.addOne(state.objects, payload);
    })
  )
  .handleAction(actions.setIsSelectionDisabled, (state, { payload }) =>
    produce(state, draft => {
      draft.isSelectionDisabled = payload;
    })
  )
  .handleAction(actions.selectObject, (state, { payload: { id, clearSelection } }) =>
    produce(state, draft => {
      draft.selectedObjects = [id];
    })
  )
  .handleAction(actions.deselectAllObjects, (state) =>
    produce(state, draft => {
      draft.selectedObjects = [];
    })
  )
  .handleAction(actions.updateObjectTransform, (state, { payload: { id, transform } }) =>
    produce(state, draft => {
      draft.objects = objectAdapter.updateOne(
        state.objects, 
        { id, changes: { transform } }
      );
    })
  )
  .handleAction(actions.updateObjectPosition, (state, { payload: { id, position } }) =>
    produce(state, draft => {
      const transform = {
        ...selectors.selectById(state.objects, id)?.transform,
        position
      } as Transform;

      draft.objects = objectAdapter.updateOne(
        state.objects, 
        { id, changes: { transform } }
      );
    })
  )
  .handleAction(actions.updateObjectScale, (state, { payload: { id, scale } }) =>
    produce(state, draft => {
      const transform = {
        ...selectors.selectById(state.objects, id)?.transform,
        scale
      } as Transform;

      draft.objects = objectAdapter.updateOne(
        state.objects, 
        { id, changes: { transform } }
      );
    })
  )
  .handleAction(actions.updateObjectRotation, (state, { payload: { id, rotation } }) =>
    produce(state, draft => {
      const transform = {
        ...selectors.selectById(state.objects, id)?.transform,
        rotation
      } as Transform;

      draft.objects = objectAdapter.updateOne(
        state.objects, 
        { id, changes: { transform } }
      );
    })
  )
  .handleAction(actions.updateLight, (state, { payload: { id, light } }) =>
    produce(state, draft => {
      draft.objects = objectAdapter.updateOne(
        state.objects, 
        { id, changes: light }
      );
    })
  )
  .handleAction(actions.deleteObject, (state, { payload }) =>
    produce(state, draft => {
      draft.objects = objectAdapter.removeOne(state.objects, payload);
    })
  );

export default undoable(reducer, {
  ignoreInitialState: true,
  undoType: getType(actions.undo),
  redoType: getType(actions.redo),
  filter: isActionOf([
    actions.addObject,
    actions.selectObject,
    actions.updateObjectTransform,
    actions.updateObjectPosition,
    actions.updateObjectScale,
    actions.updateObjectRotation,
    actions.updateLight,
    actions.deselectAllObjects,
    actions.deleteObject
  ]),
  groupBy: groupByActionTypes([
    getType(actions.selectObject),
    getType(actions.deselectAllObjects),
    getType(actions.updateObjectPosition),
    getType(actions.updateObjectScale),
    getType(actions.updateObjectRotation),
  ])
});
