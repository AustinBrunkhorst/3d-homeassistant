import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import areaEditor from "./areaEditor.reducer";
import assets from "./asset.reducer";
import hass from "./hass.reducer";

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    hass,
    assets,
    areaEditor
  });

export type State = ReturnType<ReturnType<typeof createRootReducer>>;

export default createRootReducer;

