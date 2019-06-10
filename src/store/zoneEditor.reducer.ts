import produce from 'immer';
import { ActionType, createReducer } from 'typesafe-actions';

import { DroppedAsset } from 'store/asset.models';
import * as actions from './zoneEditor.actions';

export type Actions = ActionType<typeof actions>;

export interface ZoneEditorState {
  droppedAssets: DroppedAsset[];
}

export const initialState: ZoneEditorState = {
  droppedAssets: []
};

const reducer = createReducer(initialState)
  .handleAction(actions.dropAsset, (state, { payload: { id, asset, position } }) =>
    produce(state, draft => {
      // TODO: add clear selection option
      for (const asset of draft.droppedAssets) {
        asset.selected = false;
      }

      draft.droppedAssets.push({
        id,
        asset,
        position,
        selected: true
      });;
    })
  )
  .handleAction(actions.selectAsset, (state, { payload: { instanceId } }) =>
    produce(state, draft => {
      for (const asset of draft.droppedAssets) {
        asset.selected = asset.id === instanceId;
      }
    })
  ).handleAction(actions.deselectAllAssets, (state) =>
    produce(state, draft => {
      for (const asset of draft.droppedAssets) {
        asset.selected = false;
      }
    }));

export default reducer;
