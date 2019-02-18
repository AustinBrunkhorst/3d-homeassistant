import React, { useRef, useState } from "react";

import { useWebGLRenderer } from "../hooks/Renderer";
import { useHomeController } from "../hooks/HomeController";
import { FullscreenCanvas } from "./FullscreenCanvas";

export function IsometricHomeView() {
  const [ready, setReady] = useState(false);

  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useWebGLRenderer(canvas);

  useHomeController(renderer, setReady);

  return (
    <>
      <h1 style={{ color: "black" }}>{!ready && "Loading..."}</h1>
      <FullscreenCanvas ref={canvas} />
    </>
  );
}
