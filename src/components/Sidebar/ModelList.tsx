import React, { useMemo, useRef, useState } from "react";
import { useSize } from "react-hook-size";
import { useSelector } from "react-redux";
import VirtualList from "react-tiny-virtual-list";
import styled from "styled-components";
import { Model } from "store/models/areaEditor.model";
import { getAllAssets } from "store/selectors/asset.selector";
import AssetListItem from "./ModelListItem";
import SearchInput from "./SearchInput";

const itemHeight = 62;

const Container = styled.div`
  flex: 1;
  overflow: hidden;
`;

function ModelList() {
  const assets = useSelector(getAllAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAssets = useMemo(() => filterAssets(searchQuery, assets), [
    assets,
    searchQuery
  ]);
  
  const ref = useRef(null);
  const { width, height } = useSize(ref);

  return (
    <Container ref={ref}>
      <SearchInput onChange={setSearchQuery} value={searchQuery} />
      <VirtualList
        width={width || 0}
        height={height || 0}
        itemCount={filteredAssets.length}
        itemSize={itemHeight}
        renderItem={({ index, style }) => {
          const model = filteredAssets[index];

          return (
            <div style={style} key={model.title}>
              <AssetListItem model={model} />
            </div>
          );
        }}
      />
    </Container>
  );
}

function filterAssets(query: string, assets: Model[]): Model[] {
  const sanitizedQuery = query.toLowerCase();

  if (query === "") {
    return assets;
  }

  return assets.filter(
    ({ title }) => title.toLowerCase().includes(sanitizedQuery)
  );
}

export default ModelList;
