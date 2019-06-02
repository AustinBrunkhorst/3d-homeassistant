import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";

export const AssetThumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

export const RootContainer = styled(Drawer)`
  overflow-y: auto;
  flex-shrink: 0;
  width: 350px;
`;

export const ListContainer = styled(List)`
  width: 100%;
  overflow: auto;
`;
