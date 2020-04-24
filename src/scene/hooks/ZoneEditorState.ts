import { createContext, useContext } from "react";
import { initialState, ZoneEditorState } from "store/zoneEditor.reducer";

interface ContextProps {
  state: ZoneEditorState;
  dispatch: Function;
}

export const context = createContext<ContextProps>({
  state: initialState,
  dispatch: () => { }
});

export default function useZoneEditorState(): [ZoneEditorState, Function] {
  const { state, dispatch } = useContext(context);

  return [state, dispatch];
}