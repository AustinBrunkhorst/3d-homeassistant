import React from "react";
import ReactDOM from "@hot-loader/react-dom";

import GlobalStyle from "./GlobalStyle";
import App from "./App";

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
);
