import { all } from "redux-saga/effects";
import hassSaga from "./hass";

export default function* rootSaga() {
  yield all([
    hassSaga()
  ]);
}