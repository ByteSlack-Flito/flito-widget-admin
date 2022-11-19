import { collection, getFirestore, doc } from 'firebase/firestore'

export const getCollection = (auth, name) => {
  const firestoreRef = getFirestore(auth)
  return collection(firestoreRef, name)
}
