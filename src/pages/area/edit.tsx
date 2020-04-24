import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import AssetSidebar from "components/AssetSidebar";
import ZoneEditorScene from "scene/ZoneEditorScene";
import * as hass from "store/hass.actions";
import { selectAreas } from "store/hass.selector";

const PageContainer = styled(Box)`
  height: 100%;
  overflow: hidden;
`;

function AreaEditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const areas = useSelector(selectAreas, shallowEqual);

  if (!areas) {
    dispatch(hass.loadAreasAsync.request());

    return <CircularProgress />;
  }

  const area = areas[id];

  if (!area) {
    return <>Area with ID {id} not found.</>;
  }

  return (
    <PageContainer display="flex" flexDirection="row">
      <AssetSidebar />
      <Box flexGrow={1} style={{ height: "100%" }}>
        <ZoneEditorScene />
      </Box>
    </PageContainer>
  );
}

export default AreaEditPage;
