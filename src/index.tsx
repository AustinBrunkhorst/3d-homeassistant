import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
    AuthData, callService, createConnection, getAuth, getStates
} from 'home-assistant-js-websocket';
import React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { StateInspector } from 'reinspect';
import { ReduxProvider } from 'use-redux';

import App from './App';
import { isProd } from './environment';
import GlobalStyle from './GlobalStyle';
import { register as registerServiceWorker } from './serviceWorker';
import { configureStore } from './store';

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
    <DragDropContextProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <ReduxProvider store={store}>
          <StateInspector>
            <GlobalStyle />
            <Component />
          </StateInspector>
        </ReduxProvider>
      </ThemeProvider>
    </DragDropContextProvider>,
    document.getElementById("root")
  );
}

if (isProd) {
  registerServiceWorker();
}

function saveAuthLocalStorage(data) {
  localStorage.setItem("auth", JSON.stringify(data));
}

function restoreAuthLocalStorage() {
  return Promise.resolve(JSON.parse(
    localStorage.getItem("auth") || "null"
  ) as AuthData);
}

async function connect() {
  let auth;

  try {
    // Try to pick up authentication after user logs in
    auth = await getAuth({
      hassUrl: "http://hassio.local:8123",
      saveTokens: saveAuthLocalStorage,
      loadTokens: restoreAuthLocalStorage
    });
  } catch (e) {
    console.log("error logging in", e);
  }

  const connection = await createConnection({ auth });

  const result = await getStates(connection);

  for (const state of result) {
    console.log(state.entity_id, state.attributes);
  }
}

connect();

render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}
