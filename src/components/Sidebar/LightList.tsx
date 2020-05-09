import React, { useRef } from "react";
import { useSize } from "react-hook-size";
import VirtualList from "react-tiny-virtual-list";
import styled from "styled-components";
import LightListItem from "./LightListItem";
import { HassEntity } from "home-assistant-js-websocket";
import SearchInput from "./SearchInput";
import { useState, useMemo } from "react";

const itemHeight = 62;

const Container = styled.div`
  flex: 1;
  overflow: hidden;
`;

function LightList({ lights }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredLights = useMemo(() => filterLights(searchQuery, lights), [
    lights,
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
        itemCount={filteredLights.length}
        itemSize={itemHeight}
        renderItem={({ index, style }) => {
          const light = filteredLights[index];

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

function filterLights(query: string, lights: HassEntity[]): HassEntity[] {
  const sanitizedQuery = query.toLowerCase();

  if (query === "") {
    return lights;
  }

  return lights.filter(
    ({ entity_id }) => entity_id.toLowerCase().includes(sanitizedQuery)
  );
}

export default LightList;
