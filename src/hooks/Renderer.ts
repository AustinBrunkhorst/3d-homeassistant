import { useRef, useEffect, RefObject } from "react";
import { WebGLRenderer, PCFSoftShadowMap } from "three";

import { Nullable } from "../util/Types";
import { useEventListener } from "./EventListener";

export type ResizeCallback = (width: number, height: number) => void;

export function useWebGLRenderer(
  target: RefObject<HTMLCanvasElement>,
  onResize?: ResizeCallback
) {
  const renderer = useRef<Nullable<WebGLRenderer>>(null);

  useEffect(() => {
    if (!target.current) {
      return;
    }

    renderer.current = new WebGLRenderer({
      canvas: target.current,
      antialias: true
    });

    updateViewportSize();

    renderer.current.shadowMap.enabled = false;
    renderer.current.shadowMap.type = PCFSoftShadowMap;

    return () => {
      if (renderer.current) {
        renderer.current.dispose();
      }
    };
  }, [target.current]);

  const updateViewportSize = () => {
    if (!renderer.current || !target.current) {
      return;
    }

    const { innerWidth, innerHeight } = window;

    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize(innerWidth, innerHeight, false);
  };

  useEventListener(window, "resize", () => {
    updateViewportSize();

    if (onResize) {
      onResize(innerWidth, innerHeight);
    }
  });

  return renderer;
}
