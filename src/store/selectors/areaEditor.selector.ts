import { createSelector } from "reselect";
import { SceneObject } from "store/models/areaEditor.model";
import { AreaEditorState, selectors } from "store/reducers/areaEditor.reducer";
import { State } from "../reducers/index";

export const selectAreaEditor = (state: State) => state.areaEditor.present; 
export const selectAreaId = createSelector(selectAreaEditor, (state: AreaEditorState) => state.areaId);
export const selectObjects = createSelector(selectAreaEditor, (state: AreaEditorState) => selectors.selectAll(state.objects));
export const selectSelectedObjectIds = createSelector(selectAreaEditor, (state: AreaEditorState) => state.selectedObjects);
export const selectSelectedObjects = createSelector(selectAreaEditor, state => state.selectedObjects.map(id => selectors.selectById(state.objects, id) as SceneObject));