import { combineReducers, createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from '@redux-saga/core'
import rootSaga from '../sagas/rootSaga'
import userReducer from './userReducer'
import firebaseReducer from './firebaseReducer'

export const reducer = combineReducers({
  user: userReducer,
  firebaseApp: firebaseReducer
})

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)
// action = (type, payload) => store.dispatch({type, payload})
export default store
