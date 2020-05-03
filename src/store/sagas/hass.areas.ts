import { Connection } from "home-assistant-js-websocket";
import { call, put } from "redux-saga/effects";
import { AreaConfiguration } from "store/models/hass.model";
import * as actions from "../actions/hass.actions";

export function *loadAreas(connection: Connection) {
  try {
    const areas = yield call(getAreas, connection);

    yield put(actions.loadAreasAsync.success(areas));
  } catch (e) {
    yield put(actions.loadAreasAsync.failure(e));
  }
}
  
function getAreas(connection: Connection) {
    return connection.sendMessagePromise<AreaConfiguration[]>({ type: "config/area_registry/list" });
}