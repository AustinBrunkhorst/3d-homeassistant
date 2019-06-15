import React, { useMemo, useState } from 'react';
import { useRedux } from 'use-redux';

import { AssetMetadata } from 'store/asset.models';
import AssetList from './AssetList';
import { RootContainer } from './elements';
import Navigation from './Navigation';
import SearchInput from './SearchInput';

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
      <Navigation />
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
