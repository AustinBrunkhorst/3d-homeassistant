import { useEffect } from "react";

export function useEventListener(
  target: EventTarget,
  event: string,
  listener: EventListenerOrEventListenerObject
) {
  useEffect(() => {
    target.addEventListener(event, listener);

    return () => target.removeEventListener(event, listener);
  }, [target, event, listener]);
}
