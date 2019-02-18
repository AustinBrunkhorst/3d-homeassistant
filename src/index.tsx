import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import { App } from "./App";

function render() {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("root")
  );
}

render();

//serviceWorker.unregister();

if (module.hot) {
  module.hot.accept("./App", () => {
    render();
  });
}
