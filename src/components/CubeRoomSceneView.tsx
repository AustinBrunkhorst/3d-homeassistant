import React, { useRef, useEffect } from "react";

import { Nullable } from "../util/Types";
import { CubeRoomState, initialState } from "../scene/CubeRoomState";
import { CubeRoomScene } from "../scene/CubeRoomScene";
import { FullscreenCanvas } from "./FullscreenCanvas";
import { useWebGLRenderer } from "../hooks/Renderer";
import { useAnimationFrame } from "../hooks/AnimationFrame";

export function CubeRoomSceneView() {
  const canvas = useRef<HTMLCanvasElement>(null);

  const sceneState = useRef<CubeRoomState>(initialState);
  const scene = useRef<Nullable<CubeRoomScene>>(null);

  const renderer = useWebGLRenderer(canvas, () => {
    if (scene.current) {
      scene.current.onViewportResize();
    }
  });

  useEffect(() => {
    if (renderer.current) {
      scene.current = new CubeRoomScene(renderer.current, sceneState.current);

      scene.current.init();
    }

    return () => {
      if (scene.current) {
        scene.current.dispose();
      }

      if (renderer.current) {
        renderer.current.dispose();
      }
    };
  }, [canvas.current, CubeRoomScene]);

  useAnimationFrame(time => {
    if (scene.current) {
      scene.current.update(time);
      scene.current.render();
    }
  });

  return <FullscreenCanvas ref={canvas} />;
}
