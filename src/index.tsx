import deepOrange from "@material-ui/core/colors/deepOrange";
import deepPurple from "@material-ui/core/colors/deepPurple";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import ReactDOM from "react-dom";
import { Provider as StoreProvider } from "react-redux";
import { StateInspector } from "reinspect";
import App from "./App";
import { isProd } from "./environment";
import GlobalStyle from "./GlobalStyle";
import { register as registerServiceWorker } from "./serviceWorker";
import configureStore, { history } from "./store";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: deepPurple,
    secondary: deepOrange
  }
});

const store = configureStore();

function render(Component) {
  ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <StoreProvider store={store}>
          <ConnectedRouter history={history}>
            <StateInspector>
              <GlobalStyle />
              <Component />
            </StateInspector>
          </ConnectedRouter>
        </StoreProvider>
      </ThemeProvider>
    </DndProvider>,
    document.getElementById("root")
  );
}

if (isProd) {
  registerServiceWorker();
}

render(App);
