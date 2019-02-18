import { MutableRefObject, useRef, useEffect } from "react";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Color,
  Box3,
  Vector3,
  Object3D
} from "three";

import { Nullable } from "../util/Types";
import { Room } from "../scene/Room";
import { loadFbxFile } from "../util/Model";
import { fitOrthoDimensionsToObjects as fitFrustumDimensionsToObjects } from "../util/Camera";
import { useAnimationFrame } from "./common/AnimationFrame";
import { useEventListener } from "./common/EventListener";

// object name prefix for room groups
const roomObjectNamePrefix = "room";

export function useHomeController(
  renderer: MutableRefObject<Nullable<WebGLRenderer>>,
  setReady: (ready: boolean) => void
) {
  const camera = useRef<Nullable<OrthographicCamera>>(null);
  const scene = useRef<Nullable<Scene>>(null);

  const rooms = useRef<Room[]>([]);

  const loadRooms = async () => {
    if (!renderer.current || !scene.current) {
      throw new Error("renderer and scene musn't be null");
    }

    const object = await loadFbxFile("assets/models/rooms.fbx");

    scene.current.add(object);

    const roomObjects: Object3D[] = object.children.filter(child =>
      child.name.startsWith(roomObjectNamePrefix)
    );

    rooms.current = roomObjects.map(object => ({
      object,
      name: object.name.substr(roomObjectNamePrefix.length)
    }));

    const box = new Box3();
    const sceneCenter = new Vector3();

    box.setFromObject(object);
    box.getCenter(sceneCenter);

    const orthoCamera = new OrthographicCamera(0, 0, 0, 0);

    camera.current = orthoCamera;

    orthoCamera.position.copy(sceneCenter);
    orthoCamera.position.add(new Vector3(-30, 25, -30));
    orthoCamera.lookAt(sceneCenter);

    scene.current.add(orthoCamera);

    fitObjectsInViewport(renderer.current, orthoCamera, roomObjects);

    setReady(true);
  };

  useEffect(() => {
    scene.current = createScene();

    loadRooms();
  }, []);

  useAnimationFrame(() => {
    if (renderer.current && scene.current && camera.current) {
      renderer.current.render(scene.current, camera.current);
    }
  });

  useEventListener(window, "resize", () => {
    if (renderer.current && camera.current) {
      fitObjectsInViewport(
        renderer.current,
        camera.current,
        rooms.current.map(({ object }) => object)
      );
    }
  });
}

function createScene() {
  const scene = new Scene();

  scene.background = new Color(0x3a362c);

  return scene;
}

function fitObjectsInViewport(
  renderer: WebGLRenderer,
  camera: OrthographicCamera,
  objects: Object3D[]
) {
  const { width, height } = renderer.getSize();

  const width2Height = width / height;
  const height2Width = height / width;

  const [maxFrustumWidth, maxFrustumHeight] = fitFrustumDimensionsToObjects(
    camera,
    objects
  );

  const frustumWidth =
    maxFrustumWidth * (width2Height > 1.0 ? width2Height : 1.0);

  const frustumHeight =
    maxFrustumHeight * (height2Width > 1.0 ? height2Width : 1.0);

  camera.left = -frustumWidth;
  camera.right = frustumWidth;
  camera.top = frustumHeight;
  camera.bottom = -frustumHeight;
  camera.near = 0.01;
  camera.far = 100;
  camera.zoom = 1;

  camera.updateProjectionMatrix();
}
