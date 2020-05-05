import { StandardEffects } from "drei";
import React, { memo, Suspense, useCallback, useContext, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Provider, ReactReduxContext, useDispatch, useSelector } from "react-redux";
import { Canvas } from "react-three-fiber";
import styled from "styled-components";
import { PCFSoftShadowMap } from "three";
import "scene/extensions";
import * as actions from "store/actions/areaEditor.actions";
import { Area } from "store/models/hass.model";
import { selectObjects, selectSelectedObjects } from "store/selectors/areaEditor.selector";
import DebugStats from "./DebugStats";
import EditorEnvironment from "./EditorEnvironment";
import useAreaEditorDropTarget from "./hooks/AreaEditorDropTarget";
import MapControlsCamera from "./MapControlsCamera";
import ZoneEditorObjects from "./ZoneEditorObjects";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export interface AreaEditorSceneProps {
  area: Area;
}

export default function AreaEditorScene({ area }: AreaEditorSceneProps) {
  const dispatch = useDispatch();
  const objects = useSelector(selectObjects);
  const selectedObjects = useSelector(selectSelectedObjects);
  const nextId = useRef(0);
  const reduxContext = useContext(ReactReduxContext);

  const generateId = useCallback(() => {
    while (true) {
      const id = nextId.current;

      if (!objects.some(o => o.id === id)) {
        return id;
      }

      ++nextId.current;
    }
  }, [objects]);

  const { dragState, setContext: setDropTargetContext, context } = useAreaEditorDropTarget(generateId);

  const setContext = useCallback((context) => {
    context.gl.shadowMap.enabled = true;
    context.gl.shadowMap.type = PCFSoftShadowMap;

    console.log('context', context);
    setDropTargetContext(context);
  }, [setDropTargetContext]);

  useEffect(() => {
    dispatch(actions.loadArea.request(area.area_id));
  }, [area.area_id, dispatch]);

  useHotkeys("ctrl+z", () => {
    dispatch(actions.undo());
  });

  useHotkeys("ctrl+y", () => {
    dispatch(actions.redo());
  });

  useHotkeys("ctrl+d", (e) => {
    e.preventDefault();

    if (selectedObjects.length === 0) {
      return;
    }

    const [toDuplicate] = selectedObjects;

    dispatch(actions.addObject({
      ...toDuplicate,
      id: generateId()
    }));
  }, [selectedObjects]);

  useHotkeys("delete", () => {
    for (const { id } of selectedObjects) {
      dispatch(actions.deleteObject(id));
    }
  }, [dispatch, selectedObjects]);

  return (
    <Container>
      <Canvas concurrent onCreated={setContext} shadowMap={true}>
        <Provider store={reduxContext.store}>
          <Scene area={area} objects={objects} dragState={dragState} />
        </Provider>
      </Canvas>
      {context.current && context.current.gl && (
        <DebugStats gl={context.current.gl} />
      )}
    </Container>
  );
}

interface SceneProps {
  area: Area;
  objects: any[];
  dragState: React.MutableRefObject<any>;
}

const Scene = memo(({ area, objects, dragState }: SceneProps) => (
  <>
    <ZoneEditorObjects droppedAssets={objects} dragState={dragState} />
    <MapControlsCamera name={`camera.${area.area_id}`} />
    <EditorEnvironment />
    <Suspense fallback={null}>
      <StandardEffects
        smaa                      // Can be a boolean (default=true)
        ao                        // Can be a boolean or all valid postprocessing AO props (default=true)
        bloom                     // Can be a boolean or all valid postprocessing Bloom props (default=true)
        edgeDetection={0.1}       // SMAA precision (default=0.1)
        bloomOpacity={1}          // Bloom blendMode opacity (default=1)
      />
    </Suspense>
  </>
));
