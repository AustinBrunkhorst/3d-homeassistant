interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface Transform {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
}

export interface Model {
  guid: string;
  title: string;
  thumbnail: string;
  model: string;
}

export interface SceneObject {
  id: number;
}

export interface ModelObject extends SceneObject {
  model: Model;
  transform: Transform;
  selected: boolean;
}

type LightType = 'point' | 'spot';

export interface LightObject extends SceneObject  {
  entityId: string;
  type: LightType;
  intensity: number;
}
