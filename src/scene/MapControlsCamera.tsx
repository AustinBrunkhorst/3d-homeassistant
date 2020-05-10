import { OrbitControls } from "drei";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useResource, useThree } from "react-three-fiber";
import { Camera, PerspectiveCamera } from "three";
import { useLocalStorageRef } from "core/hooks/LocalStorage";
import * as actions from "store/actions/areaEditor.actions";
import { selectIsSelectionDisabled } from "store/selectors/areaEditor.selector";

export interface MapControlsCameraProps {
  name: string;
}

const TestOrbit: any = OrbitControls;

export function getCameraMapControls(camera: Camera) {
  return camera && camera.userData && camera.userData.controls;
}

function storeCameraMapControls(camera: Camera, controls: any) {
  if (camera) {
    camera.userData.controls = controls;
  }
}

export default function MapControlsCamera({ name }: MapControlsCameraProps) {
  const { size, setDefaultCamera } = useThree();

  const [ref, camera] = useResource<PerspectiveCamera>();
  const [setControls] = usePersistedMapControls(name);

  useEffect(() => {
    if (camera) {
      setDefaultCamera(camera);
    }
  }, [camera, setDefaultCamera]);

  return (
    <>
      <perspectiveCamera
        ref={ref}
        aspect={size ? size.width / size.height : 1}
        near={0.01}
        far={2000000}
        fov={60}
        position={[10, 10, 5]}
        onUpdate={(self: PerspectiveCamera) => {
          self.updateProjectionMatrix();
        }}
      />
        <TestOrbit
          ref={setControls}
          enableDamping={false}
          screenSpacePanning={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={0}
          maxDistance={100}
          onUpdate={controls => storeCameraMapControls(camera, controls)}
        />
      )}
    </>
  );
}

function usePersistedMapControls(name: string) {
  const dispatch = useDispatch();
  const [controls, setControls] = useState<any>();
  const [serializedState, persistState] = useLocalStorageRef(name, null, 200);
  const isSelectionDisabled = useSelector(selectIsSelectionDisabled);

  const onChange = useCallback(() => {
    if (!controls) {
      return;
    }

    if (!isSelectionDisabled) {
      dispatch(actions.setIsSelectionDisabled(true));
    }

    controls.saveState();

    persistState({
      target: controls.target0,
      position: controls.position0,
      zoom: controls.zoom0
    });
  }, [controls, dispatch, isSelectionDisabled, persistState]);

  const onEnd = useCallback(() => {
    dispatch(actions.setIsSelectionDisabled(false));
  }, [dispatch]);

  useEffect(() => {
    if (controls && serializedState != null) {
      const { target, position, zoom } = serializedState;

      if (!target || !position || isNaN(zoom)) {
        return console.error(
          `${name} serialization malformed`,
          serializedState
        );
      }

      controls.saveState();

      controls.target0.copy(target);
      controls.position0.copy(position);
      controls.zoom0 = zoom;

      controls.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, name]);

  useEffect(() => {
    if (controls) {
      controls.addEventListener("change", onChange);
      controls.addEventListener("end", onEnd);
    }

    return () => {
      if (controls) {
        controls.removeEventListener("change", onChange);
        controls.removeEventListener("end", onEnd);
      }
    };
  }, [name, controls, serializedState, persistState, onEnd, onChange]);

  return [setControls];
}
