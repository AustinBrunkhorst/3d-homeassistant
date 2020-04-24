import { State } from "./root.reducer";

export const getAuthState = (state: State) => state.hass.auth;
export const getAreas = (state: State) => Object.values(state.hass.areas);