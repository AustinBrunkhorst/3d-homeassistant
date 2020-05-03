import { getSearch, replace } from "connected-react-router";
import { Auth, AuthData, createConnection, getAuth } from "home-assistant-js-websocket";
import { call, fork, put, select, takeLatest } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import * as actions from "store/actions/hass.actions";
import { loadAreas } from "./hass.areas";
import { loadEntities, updateEntityStates } from "./hass.entities";

function* login() {
  try {
    const auth = yield call(getAuth, {
      hassUrl: "http://hassio.local:8123",
      saveTokens: (data) => localStorage.setItem("auth", JSON.stringify(data)),
      loadTokens: () => Promise.resolve(JSON.parse(localStorage.getItem("auth") || "null") as AuthData)
    });

    yield call(clearAuthQueryParams);
    yield fork(subscribeToHass, auth);
  } catch (e) {
    yield put(actions.loginAsync.failure(e));
  }
}

function* clearAuthQueryParams() {
  const search = yield select(getSearch);
  const params = new URLSearchParams(search);

  // remove auth related query params
  params.delete("auth_callback");
  params.delete("code");
  params.delete("state");

  yield put(replace({ search: params.toString() }));
}

function* subscribeToHass(auth: Auth) {
  const connection = yield call(() => createConnection({ auth }));

  yield takeLatest(getType(actions.loadEntitiesAsync.request), loadEntities, connection);
  yield takeLatest(getType(actions.loadAreasAsync.request), loadAreas, connection);

  yield fork(updateEntityStates, connection);

  yield put(actions.loginAsync.success(auth));
}

function* hassSaga() {
  yield takeLatest(getType(actions.loginAsync.request), login);
  yield takeLatest(getType(actions.loginAsync.failure), clearAuthQueryParams);
}

export default hassSaga;