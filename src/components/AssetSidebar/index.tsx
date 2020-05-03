import { makeStyles } from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ViewList from "@material-ui/icons/ViewList";
import WebAsset from "@material-ui/icons/WebAsset";
import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Model } from "store/models/areaEditor.model";
import { getAllAssets } from "store/selectors/asset.selector";
import AssetList from "./AssetList";
import { RootContainer } from "./elements";
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

  const classes = useStyles();
  const [tab, setTab] = React.useState("models");

  const handleChange = useCallback((_: React.ChangeEvent<{}>, newValue: string) => setTab(newValue), [setTab]);

  return (
    <RootContainer>
      <SearchInput onChange={setSearchQuery} value={searchQuery} />
      {tab === "models" 
        ? <AssetList assets={filteredAssets} />
        : <ObjectList />
      }
      <BottomNavigation showLabels value={tab} onChange={handleChange} className={classes.root}>
        <BottomNavigationAction label="Models" value="models" icon={<WebAsset />} />
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
