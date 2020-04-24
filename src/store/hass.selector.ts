import { createSelector } from "reselect";
import { State } from "./root.reducer";

const selectHass = (state: State) => state.hass;

export const selectLoggedIn = createSelector(selectHass, state => state.loginSuccessful);
export const selectAreas = createSelector(selectHass, state => state.areas);