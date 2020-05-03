import { makeStyles } from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ViewList from "@material-ui/icons/ViewList";
import WebAsset from "@material-ui/icons/WebAsset";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions/hass.actions";
import { Model } from "store/models/areaEditor.model";
import { getAllAssets } from "store/selectors/asset.selector";
import { selectLightEntities } from "store/selectors/hass.selector";
import AssetList from "./AssetList";
import { RootContainer } from "./elements";
import LightList from "./LightList";
import { ObjectList } from "./ObjectList";
import SearchInput from "./SearchInput";

const useStyles = makeStyles({
  root: {
    flexGrow: 0,
    maxWidth: 500,
  },
});

function AssetSidebar() {
  const assets = useSelector(getAllAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAssets = useMemo(() => filterAssets(searchQuery, assets), [
    assets,
    searchQuery
  ]);
  const dispatch = useDispatch();

  const classes = useStyles();
  const [tab, setTab] = useState("models");

  const handleChange = useCallback((_: React.ChangeEvent<{}>, newValue: string) => setTab(newValue), [setTab]);

  useEffect(() => {
    dispatch(actions.loadEntitiesAsync.request());
  }, []);

  const lights = useSelector(selectLightEntities);

  const selectedTab = useMemo(() => {
    switch (tab) {
      case "models":
        return <AssetList models={filteredAssets} />;
      case "lights":
        return <LightList lights={lights} />;
      case "scene":
        return <ObjectList />;
    }
  }, [tab, filteredAssets, lights]);

  return (
    <RootContainer>
      <SearchInput onChange={setSearchQuery} value={searchQuery} />
      {selectedTab}
      <BottomNavigation showLabels value={tab} onChange={handleChange} className={classes.root}>
        <BottomNavigationAction label="Models" value="models" icon={<WebAsset />} />
        <BottomNavigationAction label="Lights" value="lights" icon={<WebAsset />} />
        <BottomNavigationAction label="Objects" value="scene" icon={<ViewList />} />
      </BottomNavigation>
    </RootContainer>
  );
}

function filterAssets(query: string, assets: Model[]): Model[] {
  const sanitizedQuery = query.toLowerCase();

  if (query === "") {
    return assets;
  }

  return assets.filter(
    ({ title }) => title.toLowerCase().indexOf(sanitizedQuery) !== -1
  );
}

export default AssetSidebar;
