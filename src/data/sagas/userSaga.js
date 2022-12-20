import { put, takeEvery } from 'redux-saga/effects'
import {
  AuthActions} from '../actions/userActions'
import {
  setLoadingState,
  setUser
} from '../reducers/userReducer'
import { Constants } from '../constants'

function * performSetUser (payload) {
  const { userId } = payload.data

  if (userId) {
    // yield put(setUser(userId))
    // yield put(setLoadingState(Constants.LoadingState.SUCCESS))
  }
}

export default function * userSaga () {
  // yield takeEvery(AuthActions.SET_USER_SUCCESS, performSetUser)
}
