export interface AssetMetadata {
  guid: string;
  title: string;
  thumbnail: string;
  model: string;
}

export interface DroppedAsset {
  id: number;
  asset: AssetMetadata;
  position: { x: number; y: number; z: number };
  selected: boolean;
}
