import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import databaseMiddleware from './middleware/databaseMiddleware';
import {getInitialState} from '../syncDB';

export default async function createStore() {
  const middleware = [databaseMiddleware];

  let finalCreateStore;

  if (__DEV__ && __CLIENT__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../../containers/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  // const storeCreateFunc = applyMiddleware(...middleware)(_createStore);

  const reducer = require('./modules/reducer');

  const storeInitialState = await getInitialState();

  // const store = storeCreateFunc(reducer, storeInitialState);
  const store = finalCreateStore(reducer, storeInitialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./modules/reducer', () => {
      const nextRootReducer = require('./modules/reducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
