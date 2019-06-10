import * as THREE from 'three';
import { createStandardAction } from 'typesafe-actions';

import { AssetMetadata } from './asset.models';

export const dropAsset = createStandardAction("zoneEditor/DROP_MODEL_ASSET")<{
  id: number;
  asset: AssetMetadata;
  position: THREE.Vector3;
}>();

export const selectAsset = createStandardAction("zoneEditor/SELECT_ASSET")<{
  instanceId: number;
  clearSelection?: boolean;
}>();

export const deselectAllAssets = createStandardAction("zoneEditor/DESELECT_ALL_ASSETS")();
