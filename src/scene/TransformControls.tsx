import useEventListener from "@use-it/event-listener";
import { TransformControls as ThreeTransformControls } from "drei";
import React, { KeyboardEvent, useEffect } from "react";
import { useThree, useUpdate } from "react-three-fiber";
import { MathUtils as ThreeMath } from "three";
import { getCameraMapControls } from "./MapControlsCamera";

const TestThreeControls: any = ThreeTransformControls;

function TransformControls({ object, onChange, onMouseDown, onMouseUp }) {
  const { camera } = useThree();

  const ref = useUpdate<any>(
    controls => {
      if (object) {
        controls.attach(object);
      }
    },
    [object]
  );

  useEffect(() => {
    function disableCameraControls(disable: boolean) {
      const cameraControls = getCameraMapControls(camera);

      if (cameraControls) {
        cameraControls.enabled = !disable;
      }
    }

    const onDrag = ({ value: isDragging, ...r }) => {
      disableCameraControls(isDragging)
    };

    const transformControls = ref.current;

    if (transformControls) {
      transformControls.addEventListener("dragging-changed", onDrag);
      transformControls.addEventListener("objectChange", onChange);
      transformControls.addEventListener("mouseDown", onMouseDown);
      transformControls.addEventListener("mouseUp", onMouseUp);
    }

    return () => {
      if (transformControls) {
        transformControls.removeEventListener('dragging-changed', onDrag);
        transformControls.removeEventListener("objectChange", onChange);
        transformControls.removeEventListener("mouseDown", onMouseDown);
        transformControls.removeEventListener("mouseUp", onMouseUp);
      }
    }
  }, [ref, camera, object, onChange, onMouseDown, onMouseUp]);

  useEventListener<KeyboardEvent>("keydown", event => {
    const controls = ref.current;

    if (!controls) {
      return;
    }

    switch (event.keyCode) {
      case 81: // Q
        controls.setSpace(controls.space === "local" ? "world" : "local");
        break;
      case 17: // Ctrl
        controls.setTranslationSnap(100);
        controls.setRotationSnap(ThreeMath.degToRad(15));
        break;
      case 87: // W
        controls.setMode("translate");
        break;
      case 69: // E
        controls.setMode("rotate");
        break;
      case 82: // R
        controls.setMode("scale");
        break;
      case 187:
      case 107: // +, =, num+
        controls.setSize(controls.size + 0.1);
        break;
      case 189:
      case 109: // -, _, num-
        controls.setSize(Math.max(controls.size - 0.1, 0.1));
        break;
      case 88: // X
        controls.showX = !controls.showX;
        break;
      case 89: // Y
        controls.showY = !controls.showY;
        break;
      case 90: // Z
        controls.showZ = !controls.showZ;
        break;
      case 32: // Spacebar
        controls.enabled = !controls.enabled;
    }
  });

  return <TestThreeControls ref={ref} />;
}

export default TransformControls;
