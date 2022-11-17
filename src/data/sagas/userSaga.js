import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  AuthActions,
} from '../actions/userActions'
import {
  setLoadingState,
  setProfile,
  setProfileError,
} from '../reducers/userReducer'
import { ref, getDatabase, set, update, get, child } from 'firebase/database'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken,

} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { StorageHelper } from '../storage'
import { Constants } from '../constants'
import { ParseError } from '../../misc/errorParser'

function* performSignIn(payload) {
  const { data } = payload
  const firebaseApp = yield select(state => state.firebaseApp.instance)
  const auth = getAuth(firebaseApp)
  try {
    yield put(setProfileError())
    const signIn = yield call(
      signInWithEmailAndPassword,
      auth,
      data.email,
      data.password
    )
    if (signIn.user) {
      const database = yield call(getDatabase, firebaseApp)
      const token = yield call(getIdToken, signIn.user)
      console.log('ID Token:', token)
      const profileResult = yield call(
        get,
        child(ref(database), 'users/' + signIn.user.uid)
      )
      console.log('Found profile:', signIn.user.uid)
      yield put(setProfile(profileResult.val()))
      yield call(
        StorageHelper.SaveItem,
        { email: data.email, password: data.password },
        'auth'
      )
      // yield put(setToken(signIn.user.refreshToken))
    }
  } catch (ex) {
    let error = new FirebaseError()
    error = { ...ex }
    yield call(StorageHelper.Remove, 'auth')
    console.log('Password error is:', error)
    yield put(setProfileError(ParseError(error, 'FirebaseError')))
  }
}

function* performLocalSignIn(payload) {
  const firebaseApp = yield select(state => state.firebaseApp.instance)
  const auth = getAuth(firebaseApp)
  try {
    yield put(setProfileError())
    const localAuth = yield call(StorageHelper.GetItem, 'auth')
    if (localAuth) {
      const signIn = yield call(
        signInWithEmailAndPassword,
        auth,
        localAuth.email,
        localAuth.password
      )
      if (signIn.user) {
        // console.log('SignIn Result:', signIn.user)
        const database = yield call(getDatabase, firebaseApp)
        const profileResult = yield call(
          get,
          child(ref(database), 'users/' + signIn.user.uid)
        )
        yield put(setProfile(profileResult.val()))
        yield call(
          StorageHelper.SaveItem,
          { email: localAuth.email, password: localAuth.password },
          'auth'
        )
        yield put(setLoadingState(Constants.LoadingState.SUCCESS))
      }
    } else {
      yield put(setLoadingState(Constants.LoadingState.ERROR))
    }
  } catch (ex) {
    let error = new FirebaseError()
    error = { ...ex }
    yield call(StorageHelper.Remove, 'auth')
    yield put(setLoadingState(Constants.LoadingState.ERROR))
    yield put(setProfileError(ParseError(error, 'FirebaseError')))
  }
}



export default function* userSaga() {


  yield takeEvery(AuthActions.PERFORM_SIGNIN, performSignIn)
  yield takeEvery(AuthActions.PERFORM_SIGNIN_LOCAL, performLocalSignIn)
}
