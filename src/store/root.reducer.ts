import { combineReducers } from 'redux';

import assets from './asset.reducer';
import hass from './hass.reducer';
import zoneEditor from './zoneEditor.reducer';

export default combineReducers({
  hass,
  assets,
  zoneEditor
});
