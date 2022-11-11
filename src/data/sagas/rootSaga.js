import roadmapSaga from './roadmapSaga'
import { all } from 'redux-saga/effects'
import userSaga from './userSaga'
import firebaseSaga from './firebaseSaga'

export default function * rootSaga () {
  yield all([roadmapSaga(), userSaga(), firebaseSaga()])
}