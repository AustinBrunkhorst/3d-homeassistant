import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { isProd } from "./environment";
import { register as registerServiceWorker } from "./serviceWorker";
import GlobalStyle from "./GlobalStyle";
import App from "./App";
import { configureStore } from "./store";

function render(Component) {
  ReactDOM.render(
    <Provider store={configureStore()}>
      <GlobalStyle />
      <Component />
    </Provider>,
    document.getElementById("root")
  );
}

if (isProd) {
  registerServiceWorker();
}

render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}
