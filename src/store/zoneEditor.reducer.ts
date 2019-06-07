import { createReducer } from 'typesafe-actions';

import { add } from './zoneEditor.actions';

export interface ZoneEditorState {
  count: number;
}

const initialState = {
  count: 0
};

const reducer = createReducer(initialState).handleAction(
  add,
  (state, action) => ({ count: state.count + action.payload })
);

export default reducer;
