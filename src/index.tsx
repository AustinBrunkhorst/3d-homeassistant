import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { isProd } from "./environment";
import { register as registerServiceWorker } from "./serviceWorker";
import GlobalStyle from "./GlobalStyle";
import App from "./App";
import { configureStore } from "./store";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

function render(Component) {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={configureStore()}>
        <DragDropContextProvider backend={HTML5Backend}>
          <GlobalStyle />
          <Component />
        </DragDropContextProvider>
      </Provider>
    </ThemeProvider>,
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
