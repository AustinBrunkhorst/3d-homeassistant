import createSagaMiddleware from '@redux-saga/core';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { isProd } from '../environment';
import rootReducer from './root.reducer';
import getSagas from './sagas';

export function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(sagaMiddleware)));

  let sagaTask = sagaMiddleware.run(function* () {
    yield getSagas();
  });

  if (!isProd && module.hot) {
    module.hot.accept('./root.reducer', () => {
      const nextRootReducer = require('./root.reducer');
      store.replaceReducer(nextRootReducer);
    });

    module.hot.accept('./sagas', () => {
      const getNewSagas = require('./sagas/index');

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