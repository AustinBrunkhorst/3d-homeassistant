import { createSelector } from "reselect";
import { Quaternion, Vector3 } from "three";
import { AreaEditorState } from "store/reducers/areaEditor.reducer";
import { State } from "../reducers/index";

export const selectAreaEditor = (state: State) => state.areaEditor.present; 
export const selectAreaId = createSelector(selectAreaEditor, (state: AreaEditorState) => state.areaId);
export const selectObjects = createSelector(selectAreaEditor, (state: AreaEditorState) => state.models.map(o => ({
  ...o,
  position: new Vector3(o.position.x, o.position.y, o.position.z),
  rotation: new Quaternion(o.rotation.x, o.rotation.y, o.rotation.z, o.rotation.w),
  scale: new Vector3(o.scale.x, o.scale.y, o.scale.z),
})));