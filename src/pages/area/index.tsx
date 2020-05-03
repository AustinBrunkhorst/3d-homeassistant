import { CircularProgress, List, ListItem, ListItemText } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { Omit } from "@material-ui/types";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import styled from "styled-components";
import * as hass from "store/actions/hass.actions";
import { selectAreas } from "store/selectors/hass.selector";

interface ListItemLinkProps {
  primary: string;
  to: string;
}

const PageContainer = styled(Box)`
  height: 100%;
  overflow: hidden;
`;

function ListItemLink(props: ListItemLinkProps) {
  const { primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

function AreaIndexPage() {
  const areas = useSelector(selectAreas, shallowEqual);
  const dispatch = useDispatch();

  if (!areas) {
    dispatch(hass.loadAreasAsync.request());
  }
  
  return (
    <PageContainer display="flex" flexDirection="row">
        <List>
          {areas
            ? Object.values(areas).map(area => (
              <ListItemLink key={area.area_id} primary={area.name} to={`/area/${area.area_id}`} />
            )) 
            : (
              <CircularProgress />
            )
          }
        </List>
    </PageContainer>
  );
}

export default AreaIndexPage;
