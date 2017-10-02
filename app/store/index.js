import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'

import reducer from '../reducers'

let middlewares,
  store;

if (process.env.NODE_ENV === 'production') {
  middlewares = [thunkMiddleware]
} else {
  let createLogger = require('redux-logger').createLogger;
  let loggerMiddleware = createLogger();

  middlewares = [thunkMiddleware, loggerMiddleware]
  // if (module.hot) {   module.hot.accept(["../reducers"], () => {     const
  // nextRootReducer = require('../reducers').default
  // store.replaceReducer(nextRootReducer)   }) }
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)
const configureStore = (initialState) => createStoreWithMiddleware(reducer, initialState)
store = configureStore();

export default store;

let fakeState = ({
  user: {
    nickname: String,
    token: String
  },
  layout: {
    backgroundColor: String,
    fontWeight: Number
  },
  hitokotoDisplay: {
    hitokoto: Object,
    direction: String,
    processing: Boolean,
    lastCount: Number,
    nextCount: Number
  },
  collections: {
    inited: Boolean,
    data: Array
  }
}, 2);