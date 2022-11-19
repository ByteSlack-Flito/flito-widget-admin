import { useSelector } from 'react-redux'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { ParseFirebaseError } from '../errors'
import { StorageHelper } from '../../storage'
import axios from 'axios'

export const useFirebaseInstance = () => {
  return useSelector(state => state.firebaseApp?.instance)
}

export async function signInWithCreds (fireInstance, { email, password }) {
  if (!fireInstance) return
  const auth = getAuth(fireInstance)
  try {
    const authResult = await signInWithEmailAndPassword(auth, email, password)
    const token = await getUserIdToken(authResult.user.uid)
    StorageHelper.SaveItem('auth', token?.data)
    return { ...authResult, success: true }
  } catch (ex) {
    let error = new FirebaseError()
    error = {
      ...error,
      ...ex
    }
    return {
      error: {
        ...error,
        message: ParseFirebaseError[error.code]
      }
    }
  }
}

export async function signInWithLocal (fireInstance) {
  if (!fireInstance) return
  const auth = getAuth(fireInstance)

  try {
    const token = StorageHelper.GetItem('auth')
    const authResult = await signInWithCustomToken(auth, token)

    return { ...authResult, success: true }
  } catch (ex) {
    let error = new FirebaseError()
    error = {
      ...error,
      ...ex
    }
    return {
      error: {
        ...error,
        message: ParseFirebaseError[error.code]
      }
    }
  }
}

export async function signUpWithCreds (fireInstance, { email, password }) {
  if (!fireInstance) return
  const auth = getAuth(fireInstance)
  try {
    const authResult = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const token = await getUserIdToken(authResult.user.uid)
    StorageHelper.SaveItem(token?.data, 'auth')
    return { ...authResult, success: true }
  } catch (ex) {
    let error = new FirebaseError()
    error = {
      ...error,
      ...ex
    }
    return {
      error: {
        ...error,
        message: ParseFirebaseError[error.code]
      }
    }
  }
}

export async function getUserIdToken (uid) {
  const api = process.env.REACT_APP_FUNCTIONS_URL

  return axios.post(`${api}/getCustomToken`, {
    uid
  })
}
