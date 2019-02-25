import React from "react";
import { hot } from "react-hot-loader";

import { CubeRoomSceneView } from "./components/CubeRoomSceneView";

function App() {
  return <CubeRoomSceneView />;
}

const isProd = process.env.NODE_ENV === "production";

export default (isProd ? App : hot(module)(App));
