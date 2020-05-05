import { OrbitControls } from "drei";
import React, { useEffect, useState } from "react";
import { useResource, useThree } from "react-three-fiber";
import { Camera, PerspectiveCamera } from "three";
import { useLocalStorageRef } from "core/hooks/LocalStorage";

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
  const [controls] = usePersistedMapControls(name);

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
          ref={controls}
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
  const [controls, setControls] = useState<any>();
  const [serializedState, persistState] = useLocalStorageRef(name, null, 200);

  useEffect(() => {
    function saveControlsState() {
      if (!controls) {
        return;
      }

      controls.saveState();

      persistState({
        target: controls.target0,
        position: controls.position0,
        zoom: controls.zoom0
      });
    }

    if (controls) {
      if (serializedState != null) {
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

      controls.addEventListener("change", saveControlsState);
    }

    return () => {
      if (controls) {
        controls.removeEventListener("change", saveControlsState);
      }
    };
  }, [name, controls, serializedState, persistState]);

  return [setControls];
}
