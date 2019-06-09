import { createContext } from 'react';

import { initialState, ZoneEditorState } from 'store/zoneEditor.reducer';

interface ZoneEditorContextProps {
  state: ZoneEditorState;
  dispatch: Function;
}

export const ZoneEditorContext = createContext<ZoneEditorContextProps>({
  state: initialState,
  dispatch: () => {}
});
