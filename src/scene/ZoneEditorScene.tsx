import React, { memo, useReducer } from "react";
import { Canvas } from "react-three-fiber";
import styled from "styled-components";
import "scene/extensions";
import reducer, { initialState } from "store/zoneEditor.reducer";
import DebugStats from "./DebugStats";
import EditorEnvironment from "./EditorEnvironment";
import useZoneEditorDropTarget from "./hooks/ZoneEditorDropTarget";
import { context as ZoneEditorContext } from "./hooks/ZoneEditorState";
import MapControlsCamera from "./MapControlsCamera";
import ZoneEditorObjects from "./ZoneEditorObjects";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export default function ZoneEditorScene() {
  const [{ droppedAssets }, dispatch] = useReducer(reducer, initialState);
  const { dragState, setContext, context } = useZoneEditorDropTarget(dispatch);

  return (
    <Container>
      <Canvas onCreated={setContext}>
        <ZoneEditorContext.Provider
          value={{ state: { droppedAssets }, dispatch }}
        >
          <Scene droppedAssets={droppedAssets} dragState={dragState} />
        </ZoneEditorContext.Provider>
      </Canvas>
      {context.current && context.current.gl && (
        <DebugStats gl={context.current.gl} />
      )}
    </Container>
  );
}

interface SceneProps {
  droppedAssets: any[];
  dragState: React.MutableRefObject<any>;
}

const Scene = memo(({ droppedAssets, dragState }: SceneProps) => (
  <>
    <ZoneEditorObjects droppedAssets={droppedAssets} dragState={dragState} />
    <MapControlsCamera name="camera.zoneEditor" />
    <EditorEnvironment />
  </>
));
