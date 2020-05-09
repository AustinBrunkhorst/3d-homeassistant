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

export interface Transform {
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

type SceneObjectType = 'model' | 'light';
export type SceneObject = ModelObject | LightObject;

interface BaseSceneObject {
  id: number;
  type: SceneObjectType;
  transform: Transform;
}

export interface ModelObject extends BaseSceneObject {
  type: 'model';
  model: Model;
}

type LightType = 'point' | 'spot';

export interface LightObject extends BaseSceneObject  {
  type: 'light';
  entityId: string;
  lightType: LightType;
  intensity: number;
  distance: number;
  decay: number;
}
