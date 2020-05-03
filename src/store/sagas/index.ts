import { all } from "redux-saga/effects";
import areaEditorSaga from "./areaEditor";
import hassSaga from "./hass";

export default function* rootSaga() {
  yield all([
    hassSaga(),
    areaEditorSaga()
  ]);
}