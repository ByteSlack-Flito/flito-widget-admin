import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import {
  ProfileActions,
  AuthActions,
  ProjectActions
} from '../actions/userActions'
import {
  setLoadingState,
  setProfile,
  setProfileError,
  setProjectData,
  setTeamData
} from '../reducers/userReducer'
import { ref, getDatabase, set, update, get, child } from 'firebase/database'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken,
  signOut
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { StorageHelper } from '../storage'
import { Constants } from '../constants'
import { ParseError } from '../../misc/errorParser'

function * performGetTeam (payload) {
  // console.log('Data is:', data)
  yield put(setTeamData(payload.data))
}

function * performSignUp (payload) {
  const { data } = payload
  const firebaseApp = yield select(state => state.firebaseApp.instance)
  const auth = getAuth(firebaseApp)
  try {
    yield put(setProfileError())
    const signup = yield call(
      createUserWithEmailAndPassword,
      auth,
      data.email,
      data.password
    )
    if (signup.user) {
      console.log('SignUp Result:', signup.user.uid)
      const database = yield call(getDatabase, firebaseApp)
      try {
        const profileRef = ref(database, 'users/' + signup.user.uid)
        const profileData = {
          email: data.email,
          firstName: 'Your',
          lastName: 'Name',
          userId: signup.user.uid,
          projects: data.projects
        }
        console.log('Profile:', profileData)
        yield call(set, profileRef, profileData)
        const profileResult = yield call(
          get,
          child(ref(database), 'users/' + signup.user.uid)
        )
        yield put(setProfile(profileResult.val()))
        yield call(StorageHelper.SaveItem, signup.user.accessToken, 'auth')
      } catch (ex) {
        console.log('Something went wrong while creating profile.', ex)
      }
    }
  } catch (ex) {
    let error = new FirebaseError()
    error = { ...ex }
    yield call(StorageHelper.Remove, 'auth')
    yield put(setProfileError(ParseError(error, 'FirebaseError')))
  }
}

function * performSignIn (payload) {
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

function * performLocalSignIn (payload) {
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

function * performProfileUpdate (payload) {
  const { data } = payload
  const { userId } = yield select(state => state.user.profile)
  const firebaseApp = yield select(state => state.firebaseApp.instance)
  try {
    const database = yield call(getDatabase, firebaseApp)
    yield call(update, child(ref(database), `users/${userId}`), data)
    yield put(setProfile(data))
  } catch (ex) {
    let error = new FirebaseError()
    error = { ...ex }
    console.log('Profile update error:', ex)
    yield call(StorageHelper.Remove, 'auth')
    yield put(setLoadingState(Constants.LoadingState.ERROR))
  }
}

function * performUpdatePhaseFeature (payload) {
  const { data } = payload
  const { assignPhase, featureId, action } = data
  const firebaseApp = yield select(state => state.firebaseApp.instance)
  const { userId } = yield select(state => state.user.profile)
  const currentProject = yield select(state => state.user.profile.projects[0])

  let features = [
    ...currentProject.buildPhases[assignPhase?.toLowerCase()].features
  ]
  switch (action) {
    case 'add':
      !features.some(id => id == featureId) && features.push(featureId)
      break
    case 'remove':
      features = features.filter(id => id != featureId)
      break
  }
  let updatedProject = { ...currentProject }
  updatedProject.buildPhases[assignPhase?.toLowerCase()].features = features

  const database = yield call(getDatabase, firebaseApp)
  yield call(
    update,
    child(ref(database), `users/${userId}/projects/0`),
    updatedProject
  )
  yield put(setProjectData(updatedProject))
}

function * performSignOut () {
  yield call(StorageHelper.Remove, 'auth')
  const firebaseApp = yield select(state => state.firebaseApp.instance)
  const auth = getAuth(firebaseApp)
  yield call(signOut, auth)
  yield put(setProfile())
}

export default function * userSaga () {
  yield takeEvery(ProfileActions.GET_TEAM, performGetTeam)
  yield takeEvery(AuthActions.PERFORM_SIGNUP, performSignUp)
  yield takeEvery(AuthActions.PERFORM_SIGNIN, performSignIn)
  yield takeEvery(AuthActions.PERFORM_SIGNIN_LOCAL, performLocalSignIn)
  yield takeEvery(AuthActions.PERFORM_SIGNOUT, performSignOut)
  yield takeEvery(ProfileActions.UPDATE_PROFILE, performProfileUpdate)

  yield takeEvery(
    ProjectActions.PERFORM_FEATURE_CHANGE,
    performUpdatePhaseFeature
  )
}
