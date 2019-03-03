import React from "react";
import ReactDOM from "@hot-loader/react-dom";

import { isProd } from "./environment";
import { register as registerServiceWorker } from "./serviceWorker";
import GlobalStyle from "./GlobalStyle";
import App from "./App";

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
);

if (isProd) {
  registerServiceWorker();
}
