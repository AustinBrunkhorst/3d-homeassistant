import React from 'react';
import { useThree, useUpdate } from 'react-three-fiber';
import { Math as ThreeMath } from 'three';

import { useEventListener } from 'core/hooks/EventListener';
import { getCameraMapControls } from './MapControlsCamera';

function TransformControls({ object }) {
  const { camera, canvas } = useThree();

  console.log("render transform controls");

  const ref = useUpdate(
    controls => {
      console.log("update");

      if (object) {
        console.log("attaching");
        controls.attach(object);
      }
    },
    [object]
  );

  useEventListener(ref.current, "dragging-changed", ({ value: isDragging }) =>
    disableCameraControls(isDragging)
  );

  useEventListener(window, "keydown", event => {
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

  function disableCameraControls(disable: boolean) {
    const controls = getCameraMapControls(camera);

    console.log("disable controls", disable, controls);

    if (controls) {
      controls.enabled = !disable;
    }
  }

  return <transformControls ref={ref} args={[camera, canvas]} />;
}

export default TransformControls;
