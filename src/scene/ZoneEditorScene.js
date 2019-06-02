import { AxesHelper } from "three/src/helpers/AxesHelper";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import React, { useRef, useEffect } from "react";
import { extend, Canvas, useThree, useRender } from "react-three-fiber";

import { PersistedObject3D } from "../hooks/ThreeHelpers";

extend({ AxesHelper, MapControls });

const FocusedObject = () => (
  <mesh position={[10, 10, 0]}>
    <dodecahedronBufferGeometry attach="geometry" args={[1, 0]} />
    <meshPhongMaterial attach="material" color="red" />
  </mesh>
);

function EditorCamera() {
  const { size, setDefaultCamera, canvas } = useThree();
  const camera = useRef();
  const controls = useRef();

  //const [saveCameraState] = usePersistedCamera("editor.camera", camera.current);

  useEffect(() => {
    setDefaultCamera(camera.current);

    // function onControlsUpdated() {
    //   saveCameraState(camera.current);
    // }

    // if (controls.current) {
    //   controls.current.addEventListener("change", onControlsUpdated);
    // }

    // return () => {
    //   if (controls.current) {
    //     controls.current.removeEventListener("change", onControlsUpdated);
    //   }
    // };
  }, [camera.current, controls.current]);

  useRender(() => {
    if (controls.current) {
      controls.current.update();
    }
  });

  return (
    <>
      <PersistedObject3D
        name="editor.camera"
        renderObject={<perspectiveCamera />}
        ref={camera}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        fov={55}
        position={[10, 10, 5]}
        onUpdate={self => self.updateProjectionMatrix()}
      />

      {/* <perspectiveCamera
        ref={camera}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        fov={55}
        position={[10, 10, 5]}
        onUpdate={self => self.updateProjectionMatrix()}
      /> */}
      {camera.current && canvas && (
        <mapControls
          ref={controls}
          args={[camera.current, canvas]}
          enableDamping={false}
          dampingFactor={0.25}
          screenSpacePanning={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={100}
        />
      )}
    </>
  );
}

function EnvironmentPlane() {
  return (
    <mesh rotation-y={Math.PI}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshPhongMaterial attach="material" color="green" />
    </mesh>
  );
}

// function Debug() {
//   return <axesHelper args={[4]} />;
// }

export default function ZoneEditorScene() {
  return (
    <Canvas>
      <EditorCamera />
      <ambientLight color="gray" />
      <pointLight color="white" intensity={1} position={[0, 0, 10]} />
      <EnvironmentPlane />
      <FocusedObject />
      {/* <Debug /> */}
    </Canvas>
  );
}
