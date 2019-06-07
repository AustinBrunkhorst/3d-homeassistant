import React, { useMemo, useState } from 'react';
import { useRedux } from 'use-redux';
import AssetList from './AssetList';
import { RootContainer } from './elements';
import SearchInput from './SearchInput';

import { AssetMetadata } from 'store/asset.models';

function AssetSidebar() {
  const [{ assets }] = useRedux();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAssets = useMemo(() => filterAssets(searchQuery, assets), [
    assets,
    searchQuery
  ]);

  return (
    <RootContainer>
      <SearchInput onChange={setSearchQuery} value={searchQuery} />
      <AssetList assets={filteredAssets} />
    </RootContainer>
  );
}

function filterAssets(query: string, assets: AssetMetadata[]): AssetMetadata[] {
  const sanitizedQuery = query.toLowerCase();

  if (query === "") {
    return assets;
  }

  return assets.filter(
    ({ title }) => title.toLowerCase().indexOf(sanitizedQuery) !== -1
  );
}

export default AssetSidebar;
