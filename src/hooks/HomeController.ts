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
  Light
} from "three";

import { Nullable } from "../util/Types";
import { Room } from "../scene/Room";
import { fitObjectsInViewport } from "../util/Camera";
import { loadFbxFile } from "../util/Model";
import { useAnimationFrame } from "./common/AnimationFrame";
import { useEventListener } from "./common/EventListener";

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

    const roomObjects: Object3D[] = sceneGraph.children.filter(child =>
      child.name.startsWith(roomObjectNamePrefix)
    );

    rooms.current = roomObjects.map(createRoomFromObject);

    const directionalLight = sceneGraph.getObjectByName(
      globalDirectionalLightObjectName
    );

    if (directionalLight) {
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
    orthoCamera.lookAt(sceneCenter);

    fitObjectsInViewport(renderer.current, orthoCamera, roomObjects);

    setReady(true);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useAnimationFrame(time => {
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

function createRoomFromObject(rootObject: Object3D) {
  const object = rootObject.clone();

  const name = object.name.substr(roomObjectNamePrefix.length);

  const lightTransforms = object.children.filter(child =>
    child.name.startsWith(lightObjectNamePrefix)
  ) as Light[];

  const scene = createRoomScene();

  const lights = lightTransforms.map(transform => {
    const hue = Math.floor(Math.random() * 360);

    const light = new PointLight(new Color().setHSL(hue, 1, 0.5), 0.75, 50);

    light.userData.hueOffset = hue;
    light.userData.transitionSpeed = Math.random() * 20000 + 3000;

    light.shadow.bias = 0.0001;
    light.castShadow = true;

    light.position.copy(transform.position);

    object.add(light);

    return light;
  });

  object.traverse(child => {
    child.castShadow = true;
    child.receiveShadow = true;
  });

  scene.add(object);

  return { name, scene, object, lights };
}

function createRoomScene() {
  return new Scene();
}
