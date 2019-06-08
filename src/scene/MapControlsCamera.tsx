import React, { useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';

import { usePersistedMapControls } from 'core/hooks/ThreeHelpers';

export interface MapControlsCameraProps {
  connect?: (instance: THREE.Camera) => void;
}

export default function MapControlsCamera({ connect }: MapControlsCameraProps) {
  const { size, setDefaultCamera, canvas } = useThree();
  const camera = useRef<THREE.Camera>();

  const [controls] = usePersistedMapControls("editor.camera");

  useEffect(() => {
    if (camera.current) {
      setDefaultCamera(camera.current);
    }
  }, [setDefaultCamera]);

  function connectCamera(instance) {
    camera.current = instance;

    if (connect) {
      connect(instance);
    }
  }

  return (
    <>
      <perspectiveCamera
        ref={connectCamera}
        aspect={size ? size.width / size.height : 1}
        near={0.01}
        far={2000000}
        fov={60}
        position={[10, 10, 5]}
        onUpdate={(self: THREE.PerspectiveCamera) => {
          self.updateProjectionMatrix();
        }}
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
