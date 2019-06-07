import { combineReducers } from 'redux';

import assets from './asset.reducer';
import zoneEditor from './zoneEditor.reducer';

export default combineReducers({
  assets,
  zoneEditor
});
