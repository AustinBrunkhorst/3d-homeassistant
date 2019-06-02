import React, { useState, useMemo } from "react";
import { connect } from "react-redux";

import { AssetMetadata } from "../../store/asset.model";
import { RootContainer } from "./elements";
import SearchInput from "./SearchInput";
import AssetList from "./AssetList";

function mapDispatchToProps() {
  return {};
}

function mapStateToProps(state) {
  return { ...state };
}

const initialState = { assets: [] };

function AssetSidebar({ assets } = initialState) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAssets = useMemo(() => filterAssets(searchQuery, assets), [
    assets,
    searchQuery
  ]);

  return (
    <RootContainer variant="permanent">
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetSidebar);
