import { useDebouncedCallback } from 'use-debounce';

export function useLocalStorageRef(key: string, initialValue = null, debounce = 1000) {
  const valueInStorage = localStorage.getItem(key);

  const currentValue =
    valueInStorage === null ? initialValue : JSON.parse(valueInStorage);

  const [persistValue] = useDebouncedCallback(state => {
    localStorage.setItem(key, JSON.stringify(state));
  }, debounce);

  return [currentValue, persistValue];
}
