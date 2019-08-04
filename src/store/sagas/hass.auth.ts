import { Auth, AuthData, createConnection, getAuth, getStates } from 'home-assistant-js-websocket';
import { call, put, takeLatest } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

import * as actions from 'store/hass.actions';

function saveAuthLocalStorage(data) {
  localStorage.setItem("auth", JSON.stringify(data));
}

function restoreAuthLocalStorage() {
  return Promise.resolve(JSON.parse(
    localStorage.getItem("auth") || "null"
  ) as AuthData);
}

async function connect() {
  let auth;

  try {
    // Try to pick up authentication after user logs in
    auth = await getAuth({
      hassUrl: "http://hassio.local:8123",
      saveTokens: saveAuthLocalStorage,
      loadTokens: restoreAuthLocalStorage
    });
  } catch (e) {
    console.log("error logging in", e);
  }

  const connection = await createConnection({ auth });

  const result = await getStates(connection);

  console.log(`got ${result.length} entity states`);

  return auth;
}

function* doAuthLogin() {
  try {
    const auth = yield call(connect);

    yield put(actions.loginAsync.success(auth));
  } catch (e) {
    yield put(actions.loginAsync.failure(e));
  }
}

function* hassAuthSaga() {
  yield takeLatest(getType(actions.loginAsync.request), doAuthLogin);
}

export default hassAuthSaga;