import produce from 'immer';
import { createReducer } from 'typesafe-actions';

import { DroppedAsset } from 'store/asset.models';
import { dropAsset, selectAsset } from './zoneEditor.actions';

export interface ZoneEditorState {
  droppedAssets: DroppedAsset[];
}

export const initialState: ZoneEditorState = {
  droppedAssets: []
};

const reducer = createReducer(initialState)
  .handleAction(dropAsset, (state, { payload: { id, asset, position } }) =>
    produce(state, draft => {
      draft.droppedAssets.push({
        id,
        asset,
        position,
        selected: true
      });
    })
  )
  .handleAction(selectAsset, (state, { payload: { instanceId } }) =>
    produce(state, draft => {
      for (const asset of draft.droppedAssets) {
        asset.selected = asset.id === instanceId;
      }
    })
  );

export default reducer;
