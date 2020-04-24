import { combineReducers } from "redux";
import assets from "./asset.reducer";
import hass from "./hass.reducer";
import zoneEditor from "./zoneEditor.reducer";

const rootReducer = combineReducers({
  hass,
  assets,
  zoneEditor
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;

