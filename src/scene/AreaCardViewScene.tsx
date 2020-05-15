import { StandardEffects } from "drei";
import React, { memo, Suspense, useContext, useEffect } from "react";
import { Provider, ReactReduxContext, useDispatch, useSelector } from "react-redux";
import { Canvas, useThree } from "react-three-fiber";
import styled from "styled-components";
import "scene/extensions";
import * as areaActions from "store/actions/areaEditor.actions";
import * as hassActions from "store/actions/hass.actions";
import { Area } from "store/models/hass.model";
import { selectObjects } from "store/selectors/areaEditor.selector";
import AreaObjects from "./AreaObjects";
import { SceneObject } from "store/models/areaEditor.model";
import { Color, OrthographicCamera, Object3D, Vector3 } from "three";
import { getBoundingBoxCenter } from "util/Geometry";
import { fitObjectsInViewport, setOrthoDimensions } from "util/Camera";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export interface AreaCardViewSceneProps {
  area: Area;
}

export default function AreaCardViewScene({ area }: AreaCardViewSceneProps) {
  const dispatch = useDispatch();
  const objects = useSelector(selectObjects);
  const reduxContext = useContext(ReactReduxContext);

  useEffect(() => {
    dispatch(areaActions.loadArea.request(area.area_id));
  }, [area.area_id, dispatch]);

  useEffect(() => {
    dispatch(hassActions.loadEntitiesAsync.request());
  }, [dispatch]);

  return (
    <Container>
      <Canvas concurrent orthographic>
        <Provider store={reduxContext.store}>
          <Scene objects={objects} />
        </Provider>
      </Canvas>
    </Container>
  );
}

interface SceneProps {
  objects: SceneObject[];
}

const Scene = memo(({ objects }: SceneProps) => {
  const { camera, scene, size } = useThree();
  
  useEffect(() => {
    if (!camera) {
      return;
    }

    const objects: Object3D[] = [];

    scene.traverse((object) => {
      if (object.type === "Mesh") {
        objects.push(object);
      }
    });

    camera.near = 0.01;
    camera.far = 200;
    focusOnObjects(camera as OrthographicCamera, objects, size);
  }, [camera, scene, size]);

  return (
    <>
      <AreaObjects objects={objects} />
      <ambientLight color={new Color("white")} intensity={0.1} />
      <Suspense fallback={null}>
        <StandardEffects
          smaa                
          ao                  
          bloom               
          edgeDetection={0.1} 
          bloomOpacity={1}
        />
      </Suspense>
    </>
  );
});

const cameraCenterOffset = new Vector3(-120, -50, -120);

function focusOnObjects(camera: OrthographicCamera, objects: Object3D[], viewport: { width: number, height: number }) {
  const center = getBoundingBoxCenter(objects);

  const newPosition = center.clone().add(cameraCenterOffset).negate();
  
  camera.position.copy(newPosition);
  camera.lookAt(center);

  camera.updateMatrixWorld(true);

  const [newOrthoWidth, newOrthoHeight] = fitObjectsInViewport(
    viewport.width,
    viewport.height,
    camera,
    objects
  );

  setOrthoDimensions(camera, newOrthoWidth, newOrthoHeight);

  camera.updateProjectionMatrix();
}
