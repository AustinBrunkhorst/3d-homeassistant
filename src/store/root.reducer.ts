import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import assets from "./asset.reducer";
import hass from "./hass.reducer";
import zoneEditor from "./zoneEditor.reducer";

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    hass,
    assets,
    zoneEditor
  });

export type State = ReturnType<ReturnType<typeof createRootReducer>>;

export default createRootReducer;

