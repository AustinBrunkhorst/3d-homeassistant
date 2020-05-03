import { createSelector } from "reselect";
import { State } from "../reducers";

const selectHass = (state: State) => state.hass;

export const selectLoggedIn = createSelector(selectHass, state => state.loginSuccessful);
export const selectAreas = createSelector(selectHass, state => state.areas);
export const selectEntityById = (id: string) => createSelector(selectHass, state => state.entities[id]);
export const selectLightEntities = createSelector(selectHass, state => Object.values(state.entities).filter(entity => entity.entity_id.indexOf('light.') === 0));