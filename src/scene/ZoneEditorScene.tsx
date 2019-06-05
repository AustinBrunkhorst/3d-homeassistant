import * as THREE from "three";
import { AxesHelper } from "three/src/helpers/AxesHelper";
import { GridHelper } from "three/src/helpers/GridHelper";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import Sky from "three-sky";
import React, { useState } from "react";
import { extend, Canvas, useRender } from "react-three-fiber";
import { DropTargetMonitor } from "react-dnd";

import {
  withDropTarget,
  DragProps,
  ZoneEditorDropHandler,
  useAssetItemDrop
} from "core/dragDrop/assetItem";
import Sun from "./Sun";
import ZoneEditorCamera from "./ZoneEditorCamera";

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

// TODO: move to functional component when react-dnd is hook stable
class ZoneEditorSceneBackup extends React.Component<DragProps>
  implements ZoneEditorDropHandler {
  constructor(props) {
    super(props);
  }

  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div style={{ width: "100%", height: "100%" }}>
        <Canvas>
          <ZoneEditorCamera />
          <ambientLight color="gray" />
          <pointLight color="white" intensity={1} position={[0, 0, 10]} />
          <EnvironmentPlane />
          <FocusedObject />
          <Debug />
        </Canvas>
      </div>
    );
  }

  dropTargetDidHover(monitor: DropTargetMonitor): void {
    if (!monitor.canDrop()) {
      return;
    }

    console.log("hover");
  }

  dropTargetDidDrop(monitor: DropTargetMonitor): void {}
}

function ZoneEditorScene() {
  const [drop] = useAssetItemDrop();

  return (
    <div ref={drop} style={{ width: "100%", height: "100%" }}>
      <Canvas>
        <ZoneEditorCamera />
        <ambientLight color="gray" />
        <pointLight color="white" intensity={1} position={[0, 0, 10]} />
        <EnvironmentPlane />
        <FocusedObject />
        <Debug />
      </Canvas>
    </div>
  );
}

export default withDropTarget(ZoneEditorScene);
