import { Object3D, PointLight, Scene, Color } from "three";

import { lightObjectNamePrefix, roomObjectNamePrefix } from "./Config";
import { SceneComponent } from "./Scene";

export class Room implements SceneComponent {
  public scene: Scene;

  name: string;
  lights: PointLight[];

  constructor(private object: Object3D) {
    this.name = object.name.substr(0, roomObjectNamePrefix.length);

    this.scene = new Scene();

    this.lights = this.buildLights();

    this.scene.add(object);
  }

  update(time: number) {
    for (const light of this.lights) {
      light.color.setHSL(
        (light.userData.hueOffset + time / light.userData.transitionSpeed) %
          360,
        1,
        0.5
      );
    }
  }

  private buildLights() {
    return this.object.children
      .filter(child => child.name.startsWith(lightObjectNamePrefix))
      .map(transform => {
        const hue = Math.random();

        const light = new PointLight(new Color().setHSL(hue, 1, 0.5), 0.75, 50);

        light.userData.hueOffset = hue;
        light.userData.transitionSpeed = Math.random() * 20000 + 3000;

        light.shadow.bias = -0.01;
        light.castShadow = false;
        light.receiveShadow = false;

        light.position.copy(transform.position);

        this.object.add(light);

        return light;
      });
  }
}
