import { useRef, useEffect, RefObject } from "react";
import { WebGLRenderer } from "three";

import { Nullable } from "../util/Types";
import { useEventListener } from "./common/EventListener";

export function useWebGLRenderer(canvas: RefObject<HTMLCanvasElement>) {
  const renderer = useRef<Nullable<WebGLRenderer>>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    renderer.current = new WebGLRenderer({
      canvas: canvas.current,
      antialias: true
    });

    fitRendererToWindow();

    return () => {
      if (renderer.current) {
        renderer.current.dispose();
      }
    };
  }, [canvas]);

  const fitRendererToWindow = () => {
    if (renderer.current) {
      renderer.current.setPixelRatio(window.devicePixelRatio);
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    }
  };

  useEventListener(window, "resize", fitRendererToWindow);

  return renderer;
}
