import { put, select, takeLatest } from "redux-saga/effects";
import * as actions from "../actions/areaEditor.actions";
import { selectAreaId, selectObjects } from "../selectors/areaEditor.selector";

function getAreaObjectStorageKey(areaId: string) {
  return `area.${areaId}.objects`;
}

function* loadArea({ payload: areaId }) {
  const objects = JSON.parse(
    localStorage.getItem(getAreaObjectStorageKey(areaId)) || "null"
  );

  yield put(actions.loadArea.success(objects || []));
}

function* saveChanges() {
  const areaId = yield select(selectAreaId);
  const objects = yield select(selectObjects);
  
  localStorage.setItem(getAreaObjectStorageKey(areaId), JSON.stringify(objects));
}

export default function* areaEditorSaga() {
  yield takeLatest(actions.loadArea.request, loadArea);
  yield takeLatest(actions.addModel, saveChanges);
  yield takeLatest(actions.updateObjectTransform, saveChanges);
  yield takeLatest(actions.deleteObject, saveChanges);
}
