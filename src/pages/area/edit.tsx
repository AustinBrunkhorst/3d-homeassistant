import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "components/Sidebar";
import AreaEditorScene from "scene/AreaEditorScene";
import * as hass from "store/actions/hass.actions";
import { selectAreas } from "store/selectors/hass.selector";

const PageContainer = styled(Box)`
  height: 100%;
  overflow: hidden;
`;

const SceneContainer = styled(Box).attrs({ flexGrow: 1 })`
  height: 100%;
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
      <Sidebar />
      <SceneContainer>
        <AreaEditorScene area={area} />
      </SceneContainer>
    </PageContainer>
  );
}

export default AreaEditPage;
