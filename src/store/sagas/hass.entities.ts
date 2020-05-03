import { Connection, getStates, StateChangedEvent } from "home-assistant-js-websocket";
import { eventChannel } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions/hass.actions";

export function *loadEntities(connection: Connection) {
  try {
    const entities = yield call(getStates, connection);

    yield put(actions.loadEntitiesAsync.success(entities));
  } catch (e) {
    yield put(actions.loadEntitiesAsync.failure(e));
  }
}

export function *updateEntityStates(connection: Connection) {
  const stateChanges = eventChannel<StateChangedEvent>(emitter => {
    let unsubscribe: () => void;

    connection
      .subscribeEvents(emitter, "state_changed")
      .then(handle => unsubscribe = handle);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  yield takeEvery(stateChanges, onEntityStateChanged);
}

function* onEntityStateChanged({ data: { entity_id, new_state: entityState } }: StateChangedEvent) {
  if (!entityState) {
    return;
  }

  yield put(actions.updateEntity({ entity_id, state: entityState }));
}