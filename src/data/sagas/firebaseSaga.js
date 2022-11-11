import { initializeApp } from 'firebase/app'
import { put, takeEvery } from 'redux-saga/effects'
import { FirebaseActions } from '../actions'
import { setFirebaseApp } from '../reducers/firebaseReducer'

function * performInit () {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  yield put(setFirebaseApp(app))
}

export default function * firebaseSaga () {
  yield takeEvery(FirebaseActions.INIT, performInit)
}
