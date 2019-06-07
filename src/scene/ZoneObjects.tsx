import React, { useMemo } from 'react';

import AssetModel from './AssetModel';

export interface ZoneObjectsProps {
  objects: any[];
  dragSource: any;
}

export default function ZoneObjects({ objects }) {
  const models = useMemo(() => {
    return objects.map(({ asset, id, position }) => (
      <AssetModel key={id} asset={asset} position={position} />
    ));
  }, [objects]);

  return <>{models}</>;
}
