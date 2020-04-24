import { AuthData, HassEntity } from "home-assistant-js-websocket";
import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./hass.actions";
import { Area } from "./hass.model";

export type Actions = ActionType<typeof actions>;

export interface HassState {
  auth?: AuthData;
  areas: { [id: string]: Area };
  entities: { [id: string]: HassEntity };
}

export const initialState: HassState = {
  areas: {},
  entities: {}
};

const reducer = createReducer(initialState)
  .handleAction(
    actions.loginAsync.success,
    (state, { payload: { data: auth } }) =>
      produce(state, draft => {
        draft.auth = auth;
      })
  )
  .handleAction(
    actions.loadAreas,
    (state, { payload }) =>
      produce(state, draft => {
        for (const area of payload) {
          draft.areas[area.area_id] = area;
        }
      })
  )
  .handleAction(
    actions.loadEntities,
    (state, { payload }) =>
      produce(state, draft => {
        for (const entity of payload) {
          draft.entities[entity.entity_id] = entity;
        }
      })
  )
  .handleAction(
    actions.updateEntity,
    (state, { payload: { entity_id, state: newState } }) =>
      produce(state, draft => {
        draft.entities[entity_id] = newState;
      })
  )

export default reducer;
