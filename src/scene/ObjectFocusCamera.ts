import { OrthographicCamera, Object3D, Vector3, WebGLRenderer } from "three";
import anime, { AnimeInstance } from "animejs";

import { SceneComponent } from "./Scene";
import {
  fitObjectsInViewport,
  setOrthoDimensions,
  getOrthoDimensions
} from "../util/Camera";
import { getBoundingBoxCenter } from "../util/Geometry";

interface AnimationState {
  width: number;
  height: number;
  x: number;
  y: number;
  z: number;
}

const cameraCenterOffset = new Vector3(-30, 25, -30);

export class ObjectFocusCamera implements SceneComponent {
  public camera: OrthographicCamera = new OrthographicCamera(0, 0, 0, 0, 0, 0);

  private animation?: AnimeInstance;
  private animationState: AnimationState = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    z: 0
  };

  private focusedObjects: Object3D[] = [];

  public constructor(private renderer: WebGLRenderer) {
    this.camera.near = 0.1;
    this.camera.far = 200;
    this.camera.zoom = 1;
  }

  public focusOnObjects(objects: Object3D[], animate: boolean = false) {
    const center = getBoundingBoxCenter(objects);

    this.focusedObjects = objects;

    const currentPosition = this.camera.position.clone();
    const newPosition = center.clone().add(cameraCenterOffset);

    if (animate) {
      const [width, height] = getOrthoDimensions(this.camera);
      const { x, y, z } = this.camera.position;

      this.animationState = {
        width,
        height,
        x,
        y,
        z
      };

      this.camera.position.copy(newPosition);
      this.camera.lookAt(center);

      this.camera.updateMatrixWorld(true);

      const [viewportWidth, viewportHeight] = this.getViewportDimensions();

      const [targetWidth, targetHeight] = fitObjectsInViewport(
        viewportWidth,
        viewportHeight,
        this.camera,
        this.focusedObjects
      );

      this.camera.position.copy(currentPosition);

      this.animation = anime({
        targets: this.animationState,
        width: targetWidth,
        height: targetHeight,
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
        easing: "spring(0.65, 100, 14, 11)",
        autoplay: false,
        update: () => {
          const { width, height, x, y, z } = this.animationState;

          this.camera.position.set(x, y, z);

          setOrthoDimensions(this.camera, width, height);

          this.camera.updateMatrixWorld(true);
        }
      });
    } else {
      this.camera.position.copy(newPosition);
      this.camera.lookAt(center);

      this.onViewportResize();
    }
  }

  public update(time: number) {
    if (this.animation && !this.animation.completed) {
      this.animation.tick(time);
    }
  }

  public onViewportResize() {
    const [viewportWidth, viewportHeight] = this.getViewportDimensions();

    this.camera.updateMatrixWorld(true);

    const [newOrthoWidth, newOrthoHeight] = fitObjectsInViewport(
      viewportWidth,
      viewportHeight,
      this.camera,
      this.focusedObjects
    );

    setOrthoDimensions(this.camera, newOrthoWidth, newOrthoHeight);
  }

  private getViewportDimensions() {
    const { width, height } = this.renderer.getSize();

    return [width, height];
  }
}
