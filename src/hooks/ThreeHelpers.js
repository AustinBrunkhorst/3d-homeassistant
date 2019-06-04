import * as THREE from "three";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

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

export function usePersistedObject(name, object, recursive = true) {
  const [serializedState, persistState] = useLocalStorageRef(name, null, 500);

  useEffect(() => {
    if (object && serializedState !== null) {
      const loader = new THREE.ObjectLoader();

      const serializedObject = loader.parse(serializedState);

      object.copy(serializedObject, recursive);
    }
  }, [object, serializedState]);

  return [
    function saveObject(object) {
      persistState(object.toJSON());
    }
  ];
}
