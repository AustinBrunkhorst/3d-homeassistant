import React, { useRef, useEffect } from "react";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { useThree, useRender } from "react-three-fiber";

import { usePersistedObject } from "hooks/ThreeHelpers";

export default function ZoneEditorCamera() {
  const { size, setDefaultCamera, canvas } = useThree();
  const camera = useRef<THREE.Camera>();
  const controls = useRef<MapControls>();

  const [saveCameraState] = usePersistedObject("editor.camera", camera.current);

  useEffect(() => {
    if (camera.current) {
      setDefaultCamera(camera.current);
    }

    function onControlsUpdated() {
      saveCameraState(camera.current);
    }

    const { current: currentControls } = controls;

    if (currentControls) {
      currentControls.addEventListener("change", onControlsUpdated);
    }

    return () => {
      if (currentControls) {
        currentControls.removeEventListener("change", onControlsUpdated);
      }
    };
  }, [saveCameraState, setDefaultCamera]);

  useRender(() => {
    if (controls.current) {
      controls.current.update();
    }
  });

  return (
    <>
      <perspectiveCamera
        ref={camera}
        aspect={size ? size.width / size.height : 1}
        near={0.01}
        far={20000}
        fov={45}
        position={[10, 10, 5]}
        onUpdate={(self: THREE.PerspectiveCamera) =>
          self.updateProjectionMatrix()
        }
      />
      {camera.current && canvas && (
        <mapControls
          ref={controls}
          args={[camera.current, canvas]}
          enableDamping={false}
          screenSpacePanning={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={100}
        />
      )}
    </>
  );
}
