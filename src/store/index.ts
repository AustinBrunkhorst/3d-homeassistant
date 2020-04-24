import createSagaMiddleware from "@redux-saga/core";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { isProd } from "../environment";
import createRootReducer from "./root.reducer";
import getSagas from "./sagas";

export const history = createBrowserHistory();

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware
      )
    )
  );

  let sagaTask = sagaMiddleware.run(function* () {
    yield getSagas();
  });

  if (!isProd && module.hot) {
    module.hot.accept('./root.reducer', () => {
      const nextRootReducer = require('./root.reducer');
      store.replaceReducer(nextRootReducer(history));
    });

    module.hot.accept('./sagas', () => {
      const getNewSagas = require('./sagas/index').default;

      sagaTask.cancel()
      sagaTask.toPromise().then(() => {
        sagaTask = sagaMiddleware.run(function* replacedSaga() {
          yield getNewSagas()
        })
      })
    })
  }

  return store;
}