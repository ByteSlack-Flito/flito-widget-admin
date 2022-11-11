import { FirebaseError } from 'firebase/app'

/**
 * Construct site-wide errors
 * @param {object} exception The exception object
 * @param {'FirebaseError' | 'other'} type Type of exception
 * @returns An exception object
 */
export function ParseError (exception, type = 'other') {
  let error = {
    message: '',
    code: 400,
    type: 'auth'
  }
  if (type === 'FirebaseError') {
    switch (exception.code) {
      case 'auth/user-not-found':
        error.message = 'No such user exists.'
        break
      case 'auth/invalid-password':
        error.message = 'Your password was incorrect.'
        break
      case 'auth/invalid-email':
        error.message = 'Please use a real-email address.'
        break
      case 'auth/email-already-exists':
        error.message = 'Email already in use. Maybe try logging in?'
        break
      case 'auth/wrong-password':
        error.message = 'Please re-check your email/password combination.'
        break

      default:
        error.message = 'Something went wrong. Please try again.'
        break
    }
  }

  return error
}
