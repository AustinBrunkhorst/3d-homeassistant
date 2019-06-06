import React from "react";

import AssetModel from "./AssetModel";

export default function ZoneObjects({ objects, dragSource }) {
  return (
    <>
      {objects.map(({ asset, id, position }) => (
        <AssetModel key={id} asset={asset} position={position} />
      ))}
      {dragSource && (
        <AssetModel asset={dragSource.asset} position={dragSource.position} />
      )}
    </>
  );
}
