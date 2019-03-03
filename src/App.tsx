import React from "react";
import { hot } from "react-hot-loader";

import { isProd } from "./environment";
import { CubeRoomSceneView } from "./components/CubeRoomSceneView";

function App() {
  return <CubeRoomSceneView />;
}

export default (isProd ? App : hot(module)(App));
