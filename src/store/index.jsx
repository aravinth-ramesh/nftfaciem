import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import reducer from "./redcuers";
import mySaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const enhancers = [applyMiddleware(...middlewares)];

// const store = createStore(reducer, compose(...enhancers , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

const store = createStore(reducer, compose(...enhancers));

sagaMiddleware.run(mySaga);

export default store;
