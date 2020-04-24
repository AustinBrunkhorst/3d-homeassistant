import {
    AuthData, Connection, createConnection, getAuth, getStates, StateChangedEvent,
} from "home-assistant-js-websocket";
import { eventChannel } from "redux-saga";
import { call, fork, put, select, take, takeLatest } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import * as actions from "store/hass.actions";
import { getAuthState } from "store/hass.selector";

function saveAuthLocalStorage(data) {
  localStorage.setItem("auth", JSON.stringify(data));
}

function restoreAuthLocalStorage() {
  return Promise.resolve(JSON.parse(
    localStorage.getItem("auth") || "null"
  ) as AuthData);
}

async function connect() {
  return await getAuth({
    hassUrl: "http://hassio.local:8123",
    saveTokens: saveAuthLocalStorage,
    loadTokens: restoreAuthLocalStorage
  });
}

function* doAuthLogin() {
  try {
    const auth = yield call(connect);

    yield put(actions.loginAsync.success(auth));
  } catch (e) {
    yield put(actions.loginAsync.failure(e));
  }
}

function* subcribeToHass() {
  const auth = yield call(connect);

  const connection = yield call(() => createConnection({ auth }));

  const entities = yield call(getStates, connection);
  yield put(actions.loadEntities(entities));

  const areas = yield call(getAreas, connection);
  yield put(actions.loadAreas(areas));

  yield fork(updateStates, connection);
}

function getAreas(connection: Connection) {
  return connection.sendMessagePromise<any>({ type: "config/area_registry/list" });
}

function *updateStates(connection: Connection) {
  const stateChanges = eventChannel<StateChangedEvent>(emitter => {
    let unsubscribe: () => void;

    connection.subscribeEvents<StateChangedEvent>(
      emitter,
      "state_changed"
    ).then(handle => unsubscribe = handle);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  while (true) {
    const { data: { entity_id, new_state: entityState } }: StateChangedEvent = yield take(stateChanges);

    if (!entityState) {
      continue;
    }

    yield put(actions.updateEntity({ entity_id, state: entityState }));
  }
}

function* hassAuthSaga() {
  yield takeLatest(getType(actions.loginAsync.request), doAuthLogin);
  yield takeLatest(getType(actions.loginAsync.success), subcribeToHass);

  const loggedIn = yield select(getAuthState);

  if (loggedIn) {
    yield call(subcribeToHass);
  } else {
    yield put(actions.loginAsync.request());
  }
}

export default hassAuthSaga;