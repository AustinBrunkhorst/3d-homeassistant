import { makeStyles } from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import ViewList from "@material-ui/icons/ViewList";
import WebAsset from "@material-ui/icons/WebAsset";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions/hass.actions";
import { selectLightEntities } from "store/selectors/hass.selector";
import { RootContainer } from "./elements";
import LightList from "./LightList";
import ModelList from "./ModelList";
import { ObjectInspector } from "./ObjectInspector";
import { ObjectList } from "./ObjectList";

const useStyles = makeStyles({
  root: {
    flexGrow: 0,
    width: 350,
  },
});

function Sidebar() {
  const dispatch = useDispatch();

  const classes = useStyles();
  const [tab, setTab] = useState("models");

  const onTabChanged = useCallback((_: React.ChangeEvent<{}>, newValue: string) => setTab(newValue), [setTab]);

  useEffect(() => {
    dispatch(actions.loadEntitiesAsync.request());
  }, [dispatch]);

  const lights = useSelector(selectLightEntities);

  const selectedTab = useMemo(() => {
    switch (tab) {
      case "models":
        return <ModelList />;
      case "lights":
        return <LightList lights={lights} />;
      case "scene":
        return <ObjectList />;
      case "inspect":
        return <ObjectInspector />;
    }
  }, [tab, lights]);

  return (
    <RootContainer>
      {selectedTab}
      <BottomNavigation showLabels value={tab} onChange={onTabChanged} className={classes.root}>
        <BottomNavigationAction label="Models" value="models" icon={<WebAsset />} />
        <BottomNavigationAction label="Lights" value="lights" icon={<WebAsset />} />
        <BottomNavigationAction label="Objects" value="scene" icon={<ViewList />} />
        <BottomNavigationAction label="Inspect" value="inspect" icon={<EditAttributesIcon />} />
      </BottomNavigation>
    </RootContainer>
  );
}

export default Sidebar;
