import {createStore, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import rootReducers from './_root-reducers'

const initialState = {}

const middlewares = [
  thunk
];

/**
 * On development use REDUX DEVTOOL EXTENSION
 * @link https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=pt-BR
 */
let composeEnhancers =  compose;
if(process.env.NODE_ENV === 'development' && process.browser){
  // @ts-ignore
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||  compose;
}

const Store = () => {
  return createStore(
    rootReducers,
    initialState,
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  )
}
export default Store;
