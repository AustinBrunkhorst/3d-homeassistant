import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { ReduxProvider } from 'use-redux';

import App from './App';
import { isProd } from './environment';
import GlobalStyle from './GlobalStyle';
import { register as registerServiceWorker } from './serviceWorker';
import { configureStore } from './store';

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const store = configureStore();

function render(Component) {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <ReduxProvider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <GlobalStyle />
          <Component />
        </DragDropContextProvider>
      </ReduxProvider>
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
