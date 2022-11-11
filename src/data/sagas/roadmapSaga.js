import { takeEvery } from 'redux-saga/effects'
import { RoadmapActions } from '../actions/roadmapActions'

function * performAddScreen () {}

export default function * roadmapSaga () {
  yield takeEvery(RoadmapActions.MVP.ADD_SCREEN, performAddScreen)
}
