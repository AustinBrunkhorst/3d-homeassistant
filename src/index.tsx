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
import { Provider } from 'react-redux';
import { StateInspector } from 'reinspect';

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
        <Provider store={store}>
          <StateInspector>
            <GlobalStyle />
            <Component />
          </StateInspector>
        </Provider>
      </ThemeProvider>
    </DragDropContextProvider>,
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
