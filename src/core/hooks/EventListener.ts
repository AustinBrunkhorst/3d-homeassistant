import { useEffect } from 'react';

export function useEventListener<T = any>(
  target: EventTarget,
  event: string,
  listener: (e: T) => void
) {
  useEffect(() => {
    if (target) {
      console.log("on", event, target);

      target.addEventListener(event, listener as any);
    }

    return () => {
      if (target) {
        console.log("off", event, target);

        target.removeEventListener(event, listener as any);
      }
    };
  }, [target, event, listener]);
}
