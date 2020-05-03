import React, { useRef } from "react";
import { useSize } from "react-hook-size";
import VirtualList from "react-tiny-virtual-list";
import styled from "styled-components";
import AssetListItem from "./AssetListItem";

const itemHeight = 62;

const Container = styled.div`
  flex: 1;
  overflow: hidden;
`;

function AssetList({ assets }) {
  const ref = useRef(null);
  const { width, height } = useSize(ref);

  return (
    <Container ref={ref}>
      <VirtualList
        width={width || 0}
        height={height || 0}
        itemCount={assets.length}
        itemSize={itemHeight}
        renderItem={({ index, style }) => {
          const asset = assets[index];

          return (
            <div style={style} key={asset.title}>
              <AssetListItem key={asset.title} asset={asset} />
            </div>
          );
        }}
      />
    </Container>
  );
}

export default AssetList;
