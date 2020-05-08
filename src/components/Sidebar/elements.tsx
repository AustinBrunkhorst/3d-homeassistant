import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";

const sidebarWidth = 350;

export const AssetThumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

export const RootContainer = styled(Drawer).attrs({ variant: "permanent" })`
  overflow-y: auto;
  flex-shrink: 0;
  width: ${sidebarWidth}px;
`;

export const ListContainer = styled(List)`
  width: 100%;
  overflow: auto;
`;

export const SearchInputContainer = styled(Paper)`
  padding: 2px 4px;
  display: flex;
  align-items: center;
  width: ${sidebarWidth}px;
`;
