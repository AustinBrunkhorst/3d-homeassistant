import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useThree } from "react-three-fiber";

function useLocalStorageRef(key, initialValue = null, debounce = 1000) {
  const valueInStorage = localStorage.getItem(key);

  const currentValue =
    valueInStorage === null ? initialValue : JSON.parse(valueInStorage);

  const [persistValue] = useDebouncedCallback(state => {
    console.log(`saving ${key}`);
    localStorage.setItem(key, JSON.stringify(state));
  }, debounce);

  return [currentValue, persistValue];
}

export function usePersistedCamera(name, camera) {
  const [serializedState, persistState] = useLocalStorageRef(name, null, 500);
  const { invalidate } = useThree();

  useEffect(() => {
    if (camera && serializedState) {
      const { aspect, far, focus, fov, matrix, near, zoom } = serializedState;

      Object.assign(camera, { aspect, far, focus, fov, near, zoom });

      camera.matrix.fromArray(matrix);
      camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);

      camera.updateProjectionMatrix();

      invalidate();
    }
  }, [camera, serializedState]);

  return [
    camera => {
      const { object } = camera.toJSON();

      persistState(object);
    }
  ];
}
