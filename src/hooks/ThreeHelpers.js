import React from "react";
// import { useDebouncedCallback } from "use-debounce";

// function useLocalStorageRef(key, initialValue = null, debounce = 1000) {
//   const valueInStorage = localStorage.getItem(key);

//   const currentValue =
//     valueInStorage === null ? initialValue : JSON.parse(valueInStorage);

//   const [persistValue] = useDebouncedCallback(state => {
//     console.log(`saving ${key}`);
//     localStorage.setItem(key, JSON.stringify(state));
//   }, debounce);

//   return [currentValue, persistValue];
// }

export function usePersistedObject(name) {
  //const [] = useLocalStorageRef(name, null, 500);

  return [];
  // return [
  //   serializedState === null ? defaultFactory() : deserializedObject,
  //   function saveObject(object) {
  //     persistState(object.toJSON());
  //   }
  // ];
}

export function PersistedObject3D({ name, renderObject, ...props }) {
  return <renderObject {...props} />;
}
