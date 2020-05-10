import { StandardEffects } from "drei";
import { BlendFunction, OutlineEffect } from "postprocessing";
import React, { memo, Suspense, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Provider, ReactReduxContext, useDispatch, useSelector } from "react-redux";
import { Canvas, useThree } from "react-three-fiber";
import styled from "styled-components";
import { Object3D, PCFSoftShadowMap } from "three";
import "scene/extensions";
import * as actions from "store/actions/areaEditor.actions";
import { Area } from "store/models/hass.model";
import { selectObjects, selectSelectedObjects } from "store/selectors/areaEditor.selector";
import AreaEditorObjects from "./AreaEditorObjects";
import DebugStats from "./DebugStats";
import EditorEnvironment from "./EditorEnvironment";
import useAreaEditorDropTarget from "./hooks/AreaEditorDropTarget";
import MapControlsCamera from "./MapControlsCamera";

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

  const selectObjectRef = useRef<(objects: Object3D[]) => void>();

  useHotkeys("escape", () => {
    dispatch(actions.deselectAllObjects());

    if (selectObjectRef.current) {
      selectObjectRef.current([]);
    }
  }, [dispatch]);

  return (
    <Container>
      <Canvas concurrent onCreated={setContext}>
        <Provider store={reduxContext.store}>
          <Scene area={area} objects={objects} dragState={dragState} selectObjectRef={selectObjectRef} />
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
  selectObjectRef: React.MutableRefObject<((objects: Object3D[]) => void) | undefined>;
}

const Scene = memo(({ area, objects, dragState, selectObjectRef }: SceneProps) => {
  const { scene, camera } = useThree();

  const outlineEffect = useMemo(() => new OutlineEffect(scene, camera, {
    blendFunction: BlendFunction.SCREEN,
    opacity: 1,
    edgeStrength: 4,
    pulseSpeed: 0,
    visibleEdgeColor: 0xffffff,
    hiddenEdgeColor: 0xb9b9b9,
    height: 720,
    blur: false,
    xRay: true
  }), [scene, camera]);

  const selectObject = useCallback((objects) => {
    outlineEffect.selection.set(objects);
  }, [outlineEffect]);

  useEffect(() => {
    selectObjectRef.current = selectObject;
  }, [selectObject, selectObjectRef]);

  return (
    <>
      <AreaEditorObjects droppedAssets={objects} dragState={dragState} selectObject={selectObject} />
      <MapControlsCamera name={`camera.${area.area_id}`} />
      <EditorEnvironment />
      <Suspense fallback={null}>
        <StandardEffects
          smaa                
          ao                  
          bloom               
          edgeDetection={0.1} 
          bloomOpacity={1}    
          effects={(e) => {
            return [...e, outlineEffect];
          }}
        />
      </Suspense>
    </>
  );
});
