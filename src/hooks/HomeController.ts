import { MutableRefObject, useRef, useEffect } from "react";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Color,
  Box3,
  Vector3,
  Object3D,
  PointLight,
  Light,
  DirectionalLight
} from "three";

import anime, { AnimeInstance } from "animejs";

import { Nullable } from "../util/Types";
import { Room } from "../scene/Room";
import {
  fitObjectsInViewport,
  setOrthoDimensions,
  getOrthoDimensions
} from "../util/Camera";
import { loadFbxFile } from "../util/Model";
import { useAnimationFrame } from "./common/AnimationFrame";
import { useEventListener } from "./common/EventListener";
import { useKeyboardPress } from "./common/KeyboardPress";

const roomFbxPath = "assets/models/rooms.fbx";

// object name for the parent of all rooms
const rootRoomsObjectName = "rooms";

// object name prefix for room groups
const roomObjectNamePrefix = "room";

// object name prefix for light groups within rooms
const lightObjectNamePrefix = "light";

const globalDirectionalLightObjectName = "directionalLight";

export function useHomeController(
  renderer: MutableRefObject<Nullable<WebGLRenderer>>,
  setReady: (ready: boolean) => void
) {
  const camera = useRef<Nullable<OrthographicCamera>>(null);

  const roomObjects = useRef<Nullable<Object3D[]>>(null);
  const rooms = useRef<Room[]>([]);

  const loadRooms = async () => {
    if (!renderer.current) {
      throw new Error("renderer was null");
    }

    const sceneGraph = await loadFbxFile(roomFbxPath);

    const roomsRoot = sceneGraph.getObjectByName(rootRoomsObjectName);

    if (!roomsRoot) {
      throw new Error(`Expected object with name "${rootRoomsObjectName}"`);
    }

    roomObjects.current = roomsRoot.children.filter(child =>
      child.name.startsWith(roomObjectNamePrefix)
    );

    rooms.current = roomObjects.current.map(createRoomFromObject);

    const directionalLight = sceneGraph.getObjectByName(
      globalDirectionalLightObjectName
    );

    if (directionalLight) {
      directionalLight.castShadow = true;
      (directionalLight as DirectionalLight).shadow.bias = -0.01;

      for (const { scene } of rooms.current) {
        scene.add(directionalLight.clone());
      }
    }

    const box = new Box3();
    const sceneCenter = new Vector3();

    box.setFromObject(sceneGraph);
    box.getCenter(sceneCenter);

    const orthoCamera = new OrthographicCamera(0, 0, 0, 0);

    camera.current = orthoCamera;

    orthoCamera.position.copy(sceneCenter);
    orthoCamera.position.add(new Vector3(-30, 25, -30));
    orthoCamera.near = 0.1;
    orthoCamera.far = 200;
    orthoCamera.zoom = 1;
    orthoCamera.lookAt(sceneCenter);

    orthoCamera.updateMatrixWorld(true);

    handleResize();

    setReady(true);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useAnimationFrame(time => {
    if (cameraAnimation.current && !cameraAnimation.current.completed) {
      cameraAnimation.current.tick(time);
    }

    if (renderer.current && camera.current) {
      for (const { lights } of rooms.current) {
        for (const light of lights) {
          light.color.setHSL(
            (light.userData.hueOffset + time / light.userData.transitionSpeed) %
              360,
            1,
            0.5
          );
        }
      }

      renderer.current.autoClear = false;

      renderer.current.clear();

      for (const { scene } of rooms.current) {
        renderer.current.render(scene, camera.current);
      }
    }
  });

  const handleResize = () => {
    if (renderer.current && camera.current && roomObjects.current) {
      const [newWidth, newHeight] = fitObjectsInViewport(
        window.innerWidth,
        window.innerHeight,
        camera.current,
        getActiveRooms()
      );

      setOrthoDimensions(camera.current, newWidth, newHeight);
    }
  };

  useEventListener(window, "resize", () => handleResize());

  const cameraAnimation = useRef<Nullable<AnimeInstance>>(null);
  const cameraAnimationState = useRef<Nullable<any>>(null);
  const selectedRoom = useRef(0);

  const getActiveRooms = () => {
    if (!roomObjects.current) {
      return [];
    }

    // 0 is all, the rest are offset by 1
    const roomIndex = Math.abs(selectedRoom.current);

    return roomIndex === 0
      ? roomObjects.current
      : [roomObjects.current[roomIndex - 1]];
  };

  const selectRoom = (delta: number) => {
    selectedRoom.current =
      (selectedRoom.current + delta) % (rooms.current.length + 1);

    if (!camera.current || !roomObjects.current || !renderer.current) {
      return;
    }

    const activeRooms = getActiveRooms();

    const [width, height] = getOrthoDimensions(camera.current);
    const { x, y, z } = camera.current.position;

    cameraAnimationState.current = {
      width,
      height,
      x,
      y,
      z
    };

    const includedRoomsBox = new Box3();

    for (const room of activeRooms) {
      includedRoomsBox.expandByObject(room);
    }

    const includedRoomsCenter = new Vector3();

    includedRoomsBox.getCenter(includedRoomsCenter);

    const newPosition = includedRoomsCenter
      .clone()
      .add(new Vector3(-30, 25, -30));

    const currentPosition = camera.current.position.clone();

    camera.current.position.copy(newPosition);

    camera.current.updateMatrixWorld(true);

    const [targetWidth, targetHeight] = fitObjectsInViewport(
      window.innerWidth,
      window.innerHeight,
      camera.current,
      activeRooms
    );

    camera.current.position.copy(currentPosition);

    cameraAnimation.current = anime({
      targets: cameraAnimationState.current,
      width: targetWidth,
      height: targetHeight,
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      duration: 600,
      easing: "spring(0.65, 100, 14, 10)",
      autoplay: false,
      update: () => {
        if (
          !camera.current ||
          !cameraAnimation.current ||
          !cameraAnimationState.current
        ) {
          return;
        }

        const animState = cameraAnimationState.current;

        camera.current.position.set(animState.x, animState.y, animState.z);

        setOrthoDimensions(camera.current, animState.width, animState.height);
      }
    });
  };

  const advanceRoom = (e: Event) => {
    e.preventDefault();

    selectRoom(1);
  };

  useEventListener(window, "mousedown", advanceRoom);
  useEventListener(window, "touchstart", advanceRoom);
}

function createRoomFromObject(rootObject: Object3D) {
  const object = rootObject.clone();

  const name = object.name.substr(roomObjectNamePrefix.length);

  const lightTransforms = object.children.filter(child =>
    child.name.startsWith(lightObjectNamePrefix)
  ) as Light[];

  const scene = createRoomScene();

  const lights = lightTransforms.map(transform => {
    const hue = Math.random();

    const light = new PointLight(new Color().setHSL(hue, 1, 0.5), 0.75, 50);

    light.userData.hueOffset = hue;
    light.userData.transitionSpeed = Math.random() * 20000 + 3000;

    light.shadow.bias = -0.01;
    light.castShadow = false;
    light.receiveShadow = false;

    light.position.copy(transform.position);

    object.add(light);

    return light;
  });

  object.traverse(child => {
    if (child.name.startsWith("wall") || child.name.startsWith("floor")) {
      child.castShadow = false;
      child.receiveShadow = false;
    } else {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(object);

  return { name, scene, object, lights };
}

function createRoomScene() {
  return new Scene();
}
