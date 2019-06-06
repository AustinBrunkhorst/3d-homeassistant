import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { useRender } from "react-three-fiber";

function useLocalStorageRef(key: string, initialValue = null, debounce = 1000) {
  const valueInStorage = localStorage.getItem(key);

  const currentValue =
    valueInStorage === null ? initialValue : JSON.parse(valueInStorage);

  const [persistValue] = useDebouncedCallback(state => {
    console.log(`saving ${key}`);
    localStorage.setItem(key, JSON.stringify(state));
  }, debounce);

  return [currentValue, persistValue];
}

export function usePersistedMapControls(name: string) {
  const [controls, setControls] = useState<MapControls>();
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
  }, [controls, serializedState, persistState]);

  useRender(() => {
    if (controls) {
      controls.update();
    }
  });

  return [setControls];
}
