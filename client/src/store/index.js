import { createStore, compose, applyMiddleware } from 'redux';
import logger from 'redux-logger'; //eslint-disable-line
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import rootSaga from '../sagas';


const sagaMiddleware = createSagaMiddleware();


export default function configureStore(initialState) {

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, logger),
      //offline(offlineConfig)
    )
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
