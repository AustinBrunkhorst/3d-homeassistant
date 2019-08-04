import { AuthData } from 'home-assistant-js-websocket';
import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import * as actions from './hass.actions';

export type Actions = ActionType<typeof actions>;

export interface HassState {
  auth?: AuthData;
}

export const initialState: HassState = {};

const reducer = createReducer(initialState)
  .handleAction(
    actions.loginAsync.success,
    (state, { payload: { data: auth } }) =>
      produce(state, draft => {
        draft.auth = auth;
      })
  );

export default reducer;
