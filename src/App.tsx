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
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.001,
      250
    )
  );
  const perspCamera = useRef<Three.PerspectiveCamera>(
    new Three.PerspectiveCamera(50, aspect, 0.01, 5000)
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
          new Three.SphereBufferGeometry(3, 15, 15),
          new Three.MeshLambertMaterial({ color: 0xff0000 })
        );

        box.getCenter(sphere.position);

        scene.current.add(sphere);

        const axesHelper = new Three.AxesHelper(5);
        scene.current.add(axesHelper);

        scene.current.add(orthoCamera.current);

        perspCamera.current.position.copy(sphere.position);
        perspCamera.current.position.add(new Three.Vector3(-30, 25, -30));
        perspCamera.current.lookAt(sphere.position);

        orthoCamera.current.copy(perspCamera.current);

        const [maxWidth, maxHeight] = fitOrthoDimensionsToObjects(
          orthoCamera.current,
          models.children.filter(child => child.name.startsWith("room"))
        );

        const frustumSize = Math.min(maxWidth, maxHeight);

        orthoCamera.current.left = (frustumSize * aspect) / -2;
        orthoCamera.current.right = (frustumSize * aspect) / 2;
        orthoCamera.current.top = frustumSize / 2;
        orthoCamera.current.bottom = frustumSize / -2;
        orthoCamera.current.near = 0.01;
        orthoCamera.current.far = 100;
        orthoCamera.current.zoom = 0.36;
        orthoCamera.current.updateProjectionMatrix();

        camera.current = orthoCamera.current;

        const cameraHelper = new Three.CameraHelper(orthoCamera.current);
        scene.current.add(cameraHelper);

        new OrbitControls(perspCamera.current, renderTarget.current);

        setLoading(false);
      },
      undefined,
      error => console.error("failed to load scene", error)
    );
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

function fitOrthoDimensionsToObjects(
  camera: Three.OrthographicCamera,
  objects: Three.Object3D[]
): [number, number] {
  let maxWidth = -Infinity;
  let maxHeight = -Infinity;

  const cameraWorldPos = new Three.Vector3();
  camera.getWorldPosition(cameraWorldPos);

  const box = new Three.Box3();
  let cameraWorldDir = new Three.Vector3();

  camera.getWorldDirection(cameraWorldDir);

  let cameraUp = new Three.Vector3().copy(cameraWorldDir);
  cameraUp.multiply(new Three.Vector3(0, 1, 0));

  let cameraRight = new Three.Vector3().copy(cameraWorldDir);
  cameraRight.multiply(new Three.Vector3(1, 0, 0));

  for (const child of objects) {
    box.setFromObject(child);

    for (const vert of getBoxVerts(box)) {
      const cameraToVert = vert.sub(cameraWorldPos);

      maxWidth = Math.max(maxWidth, Math.abs(cameraRight.dot(cameraToVert)));
      maxHeight = Math.max(maxHeight, Math.abs(cameraUp.dot(cameraToVert)));
    }
  }

  return [maxWidth, maxHeight];
}

function getBoxVerts(box: Three.Box3): Three.Vector3[] {
  const { min, max } = box;

  return [
    new Three.Vector3(min.x, min.y, min.z), // 000
    new Three.Vector3(min.x, min.y, max.z), // 001
    new Three.Vector3(min.x, max.y, min.z), // 010
    new Three.Vector3(min.x, max.y, max.z), // 011
    new Three.Vector3(max.x, min.y, min.z), // 100
    new Three.Vector3(max.x, min.y, max.z), // 101
    new Three.Vector3(max.x, max.y, min.z), // 110
    new Three.Vector3(max.x, max.y, max.z) // 111
  ];
}
