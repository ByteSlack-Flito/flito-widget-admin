import { FirebaseError } from 'firebase/app'

export const ParseFirebaseError = {
  'auth/email-already-in-use': 'Email already in-use. Try loggin-in instead.',
  'auth/invalid-password': 'Your password was incorrect.',
  'auth/user-not-found': 'No such user exists.',
  'auth/invalid-email': 'Please use a real-email address.',
  'auth/email-already-exists': 'Email already in-use. Try loggin-in instead.',
  'auth/wrong-password': 'Please re-check your email/password combination.'
}
