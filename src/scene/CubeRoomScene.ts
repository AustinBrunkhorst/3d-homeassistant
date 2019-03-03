import {
  WebGLRenderer,
  Object3D,
  Vector2,
  Raycaster,
  Mesh,
  Color
} from "three";

import { importFbx } from "../util/Model";
import { Room } from "./Room";
import { ObjectFocusCamera } from "./ObjectFocusCamera";
import { CubeRoomState } from "./CubeRoomState";
import {
  roomsModelPath,
  rootRoomsObjectName,
  roomObjectNamePrefix,
  globalDirectionalLightObjectName
} from "./Config";

export class CubeRoomScene {
  private roomObjects: Object3D[] = [];

  private rooms: Room[] = [];
  private camera: ObjectFocusCamera;

  constructor(private renderer: WebGLRenderer, private state: CubeRoomState) {
    renderer.setClearColor(new Color(0x3a362e));

    this.camera = new ObjectFocusCamera(renderer);
  }

  public async init() {
    const importedScene = await importFbx(roomsModelPath);

    const roomsRoot = importedScene.getObjectByName(rootRoomsObjectName);

    if (!roomsRoot) {
      throw new Error(`Expected object with name "${rootRoomsObjectName}"`);
    }

    this.roomObjects = roomsRoot.children
      .filter(child => child.name.startsWith(roomObjectNamePrefix))
      .map(object => object.clone());

    this.rooms = this.roomObjects.map(object => new Room(object));

    const directionalLight = importedScene.getObjectByName(
      globalDirectionalLightObjectName
    );

    // add directional light to all of the scenes
    if (directionalLight) {
      directionalLight.castShadow = true;

      for (const { scene } of this.rooms) {
        scene.add(directionalLight.clone());
      }
    }

    this.camera.focusOnObjects(this.getFocusedObjects(), false);

    this.bindEvents();
  }

  public dispose() {
    this.unbindEvents();
  }

  public update(time: number) {
    for (const room of this.rooms) {
      room.update(time);
    }

    this.camera.update(time);
  }

  public render() {
    this.renderer.autoClear = false;
    this.renderer.clear();

    for (const { scene } of this.rooms) {
      this.renderer.render(scene, this.camera.camera);
    }
  }

  public onViewportResize() {
    this.camera.onViewportResize();
  }

  private bindEvents() {
    const { domElement } = this.renderer;

    domElement.addEventListener("touchstart", this.onViewportTouchStart);
    domElement.addEventListener("click", this.onViewportClick);
  }

  private unbindEvents() {
    const { domElement } = this.renderer;

    domElement.removeEventListener("touchstart", this.onViewportTouchStart);
    domElement.removeEventListener("click", this.onViewportClick);
  }

  private onViewportTouchStart = (e: TouchEvent) => {
    // prevent black flicker on ios
    e.preventDefault();

    const touch = e.touches[0];

    if (touch) {
      this.handleViewportClick(touch.clientX, touch.clientY);
    }
  };

  private onViewportClick = (e: MouseEvent) => {
    this.handleViewportClick(e.clientX, e.clientY);
  };

  private handleViewportClick(viewportX: number, viewportY: number) {
    this.state.selectedRoomIndex =
      (this.state.selectedRoomIndex + 1) % (this.rooms.length + 1);

    const {
      x,
      y,
      width,
      height
    } = this.renderer.domElement.getBoundingClientRect() as DOMRect;

    const ndc = new Vector2();

    ndc.x = ((viewportX - x) / width) * 2 - 1;
    ndc.y = -((viewportY - y) / height) * 2 + 1;

    const raycaster = new Raycaster();

    raycaster.setFromCamera(ndc, this.camera.camera);

    // default to no selection
    this.state.selectedRoomIndex = 0;

    for (let i = 0; i < this.rooms.length; ++i) {
      const { scene } = this.rooms[i];

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        this.state.selectedRoomIndex = i + 1;

        break;
      }
    }

    this.camera.focusOnObjects(this.getFocusedObjects(), true);
  }

  private getFocusedObjects() {
    // 0 is all, the rest are offset by 1
    const roomIndex = Math.abs(this.state.selectedRoomIndex);

    return roomIndex === 0
      ? this.roomObjects
      : [this.roomObjects[roomIndex - 1]];
  }
}
