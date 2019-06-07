import { createStore } from 'redux';
import { isProd } from '../environment';
import rootReducer from './root.reducer';

export function configureStore(initialState = {}) {
  const store = createStore(rootReducer, initialState);

  if (!isProd && module.hot) {
    module.hot.accept("./root.reducer", () =>
      store.replaceReducer(rootReducer)
    );
  }

  return store;
}
