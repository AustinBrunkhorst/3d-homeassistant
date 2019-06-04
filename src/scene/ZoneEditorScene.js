import * as THREE from "three";
import { AxesHelper } from "three/src/helpers/AxesHelper";
import { GridHelper } from "three/src/helpers/GridHelper";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import Sky from "three-sky";
import React, { useRef, useEffect, useState } from "react";
import {
  extend,
  Canvas,
  useThree,
  useRender,
  useUpdate
} from "react-three-fiber";
import { DropTarget } from "react-dnd";

import { AssetListItemDragType } from "../components/AssetSidebar/AssetListItem";
import { usePersistedObject } from "../hooks/ThreeHelpers";

extend({ AxesHelper, GridHelper, MapControls, Sky });

const FocusedObject = () => {
  const [rot, setRot] = useState(0);

  useRender(() => {
    setRot(Date.now() / 1000);
  });

  return (
    <mesh position={[10, 10, 0]} rotation={[rot, 0, rot]}>
      <dodecahedronBufferGeometry attach="geometry" args={[1, 0]} />
      <meshPhongMaterial attach="material" color="red" />
    </mesh>
  );
};

function EditorCamera() {
  const { size, setDefaultCamera, canvas } = useThree();
  const camera = useRef();
  const controls = useRef();

  const [saveCameraState] = usePersistedObject("editor.camera", camera.current);

  useEffect(() => {
    setDefaultCamera(camera.current);

    function onControlsUpdated() {
      saveCameraState(camera.current);
    }

    if (controls.current) {
      controls.current.addEventListener("change", onControlsUpdated);
    }

    return () => {
      if (controls.current) {
        controls.current.removeEventListener("change", onControlsUpdated);
      }
    };
  }, [camera.current, controls.current]);

  useRender(() => {
    if (controls.current) {
      controls.current.update();
    }
  });

  return (
    <>
      <perspectiveCamera
        ref={camera}
        aspect={size.width / size.height}
        near={0.01}
        far={20000}
        fov={45}
        position={[10, 10, 5]}
        onUpdate={self => self.updateProjectionMatrix()}
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

function Sun({
  distance,
  turbidity,
  rayleigh,
  mieCoefficient,
  mieDirectionalG,
  luminance,
  elevation,
  azimuth
}) {
  const ref = useUpdate(
    ({ material: { uniforms } }) => {
      uniforms.turbidity.value = turbidity;
      uniforms.rayleigh.value = rayleigh;
      uniforms.luminance.value = luminance;
      uniforms.mieCoefficient.value = mieCoefficient;
      uniforms.mieDirectionalG.value = mieDirectionalG;

      const theta = Math.PI * (elevation - 0.5);
      const phi = 2 * Math.PI * (azimuth - 0.5);

      uniforms.sunPosition.value.set(
        distance * Math.cos(phi),
        distance * Math.sin(phi) * Math.sin(theta),
        distance * Math.sin(phi) * Math.cos(theta)
      );
    },
    [
      distance,
      turbidity,
      rayleigh,
      mieCoefficient,
      mieDirectionalG,
      luminance,
      elevation,
      azimuth
    ]
  );

  return <sky ref={ref} scale={[1000, 1000, 1000]} />;
}

function EnvironmentPlane() {
  const [sunProps, setSunProps] = useState({
    distance: 1000,
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    elevation: 0.42,
    azimuth: 0.25
  });

  useRender(() => {
    setSunProps({
      ...sunProps,
      azimuth:
        (Math.cos(Date.now() / 900000) + 1) * 0.5 * THREE.Math.degToRad(270)
    });
  });

  return (
    <>
      <Sun {...sunProps} />
      <mesh rotation={[THREE.Math.degToRad(90), 0, THREE.Math.degToRad(90)]}>
        <planeGeometry attach="geometry" args={[40, 40]} />
        <meshBasicMaterial
          attach="material"
          color="#6cdcd1"
          side={THREE.DoubleSide}
        />
      </mesh>
      <gridHelper args={[10, 20]} />
    </>
  );
}

function Debug() {
  return <axesHelper args={[4]} position={[-10, 0, -10]} />;
}

function ZoneEditorScene({ connectDropTarget }) {
  return connectDropTarget(
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas>
        <EditorCamera />
        <ambientLight color="gray" />
        <pointLight color="white" intensity={1} position={[0, 0, 10]} />
        <EnvironmentPlane />
        <FocusedObject />
        <Debug />
      </Canvas>
    </div>
  );
}

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const chessSquareTarget = {
  canDrop(props, monitor) {
    console.log("canDrop", monitor.getItem());

    return true;
  },

  hover(props, monitor, component) {
    console.log("hover", monitor.getItem(), component);
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentDidUpdate() to handle enter/leave.
    // You can access the coordinates if you need them
    // const clientOffset = monitor.getClientOffset();
    // const componentRect = findDOMNode(component).getBoundingClientRect();
    // // You can check whether we're over a nested drop target
    // const isJustOverThisOne = monitor.isOver({ shallow: true });
    // // You will receive hover() even for items for which canDrop() is false
    // const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    console.log("drop", monitor.getItem(), component);

    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    //const item = monitor.getItem();

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

export default DropTarget(AssetListItemDragType, chessSquareTarget, collect)(
  ZoneEditorScene
);
