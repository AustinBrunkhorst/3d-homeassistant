import { all } from 'redux-saga/effects';

import hassAuthSaga from './hass.auth';

export default function* rootSaga() {
  yield all([
    hassAuthSaga()
  ]);
}