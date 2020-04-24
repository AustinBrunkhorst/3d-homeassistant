import { List, ListItem, ListItemText } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import styled from "styled-components";
import { getAreas } from "store/hass.selector";

const PageContainer = styled(Box)`
  height: 100%;
  overflow: hidden;
`;

function ZoneIndexPage() {
  const areas = useSelector(getAreas, shallowEqual);
  
  return (
    <PageContainer display="flex" flexDirection="row">
        <List>
          {areas.map(area => (
            <ListItem key={area.area_id}>
              <ListItemText primary={area.name} />
            </ListItem>
          ))}
        </List>
    </PageContainer>
  );
}

export default ZoneIndexPage;
