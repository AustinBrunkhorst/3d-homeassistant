import React, { useRef } from "react";
import { useSize } from "react-hook-size";
import VirtualList from "react-tiny-virtual-list";
import styled from "styled-components";
import LightListItem from "./LightListItem";

const itemHeight = 62;

const Container = styled.div`
  flex: 1;
  overflow: hidden;
`;

function LightList({ lights }) {
  const ref = useRef(null);
  const { width, height } = useSize(ref);

  return (
    <Container ref={ref}>
      <VirtualList
        width={width || 0}
        height={height || 0}
        itemCount={lights.length}
        itemSize={itemHeight}
        renderItem={({ index, style }) => {
          const light = lights[index];

          return (
            <div style={style} key={light.entity_id}>
              <LightListItem light={light} />
            </div>
          );
        }}
      />
    </Container>
  );
}

export default LightList;
