import { Scene, Object3D, Light } from "three";

export interface Room {
  name: string;
  scene: Scene;
  object: Object3D;
  lights: Light[];
}
