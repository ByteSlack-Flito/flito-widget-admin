import { getAuth } from 'firebase/auth'
import { doc, addDoc, setDoc, getDoc, getFirestore } from 'firebase/firestore'
import { getCollection } from '../index.js'

const collectionName = `profiles`

const initalProfile = {
  firstName: 'Test',
  lastName: 'Test',
  organizationName: 'Test',
  organizationId: 'Test'
}

export async function updateProfile (
  fireInstance,
  uid,
  { data, forceInitial }
) {
  if (!fireInstance) return

  const auth = getAuth(fireInstance)
  const document = doc(getFirestore(fireInstance), collectionName, uid)
  try {
    await setDoc(document, forceInitial ? initalProfile : data)
    return { success: true }
  } catch (ex) {
    return {
      error: {
        message: "Couldn't set profile."
      }
    }
  }
}
