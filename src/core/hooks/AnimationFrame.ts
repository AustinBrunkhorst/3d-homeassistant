// https://github.com/facebook/react/issues/14195#issuecomment-437942016

import { useLayoutEffect, useRef } from 'react';

export function useAnimationFrame(callback: (time: number) => void) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const frameRef = useRef(0);

  useLayoutEffect(() => {
    const loop = (time: number) => {
      frameRef.current = requestAnimationFrame(loop);

      callbackRef.current(time);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  });
}
