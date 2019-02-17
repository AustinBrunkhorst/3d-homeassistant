import React, { useRef, useEffect, useState } from "react";
import * as Three from "three";
const OrbitControls = require("three-orbit-controls")(Three);
const FBXLoader = require("./lib/FBXLoader");

import { FullscreenCanvas } from "./components/FullscreenCanvas";
import { useAnimationFrame } from "./hooks/AnimationFrame";
import { useKeyboardPress } from "./hooks/KeyboardPress";

export const App = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const frustumSize = 600;
  const renderTarget = useRef<HTMLCanvasElement>(null);
  const scene = useRef(new Three.Scene());
  const renderer = useRef<Three.WebGLRenderer>(null as any);
  const orthoCamera = useRef<Three.OrthographicCamera>(
    new Three.OrthographicCamera(
      (frustumSize * aspect) / -4,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.001,
      50000
    )
  );
  const perspCamera = useRef<Three.PerspectiveCamera>(
    new Three.PerspectiveCamera(50, aspect, 0.01, 10000)
  );
  const camera = useRef<Three.Camera>(perspCamera.current);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    renderer.current = new Three.WebGLRenderer({
      antialias: true,
      canvas: renderTarget.current as HTMLCanvasElement
    });

    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize(window.innerWidth, window.innerHeight);

    scene.current.background = new Three.Color(0x3a362c);

    const loader = new FBXLoader();

    loader.load(
      "assets/models/main-scene.fbx",
      (models: Three.Group) => {
        scene.current.add(models);

        const boxHelper = new Three.BoxHelper(models);
        scene.current.add(boxHelper);

        const box = new Three.Box3();

        box.setFromObject(models);

        const sphere = new Three.Mesh(
          new Three.SphereBufferGeometry(3),
          new Three.MeshLambertMaterial({ color: 0xffffff })
        );

        box.getCenter(sphere.position);

        scene.current.add(sphere);

        const axesHelper = new Three.AxesHelper(5);
        scene.current.add(axesHelper);

        scene.current.add(orthoCamera.current);

        perspCamera.current.position.copy(sphere.position);
        perspCamera.current.position.add(new Three.Vector3(-50, 25, -50));
        perspCamera.current.lookAt(sphere.position);

        new OrbitControls(perspCamera.current, renderTarget.current);

        setLoading(false);
      },
      undefined,
      error => console.error("failed to load scene", error)
    );

    const cameraHelper = new Three.CameraHelper(orthoCamera.current);
    scene.current.add(cameraHelper);
  }, []);

  useAnimationFrame(() => {
    if (!renderer.current) {
      return;
    }

    renderer.current.render(scene.current, camera.current);
  });

  useKeyboardPress({
    key: "c",
    onKeyDown: () => {
      camera.current =
        camera.current === orthoCamera.current
          ? perspCamera.current
          : orthoCamera.current;
    }
  });

  return (
    <>
      {loading && "Loading scene"}
      <FullscreenCanvas ref={renderTarget} />
    </>
  );
};
