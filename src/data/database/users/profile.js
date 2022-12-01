import { FirebaseError } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCollection } from '../index.js'
import { useFirebaseInstance } from './auth.js'

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
  { data, forceInitial, merge }
) {
  if (!fireInstance) return

  const document = doc(getFirestore(fireInstance), collectionName, uid)
  try {
    await setDoc(document, forceInitial ? initalProfile : data, {
      merge: merge
    })
    return { success: true }
  } catch (ex) {
    let error = new FirebaseError()
    error = {
      ...error,
      ...ex
    }
    return {
      error: {
        ...error,
        message: "Couldn't set profile."
      }
    }
  }
}

export const useProfile = () => {
  const fireInstance = useFirebaseInstance()
  const { userId } = useSelector(state => state.user)
  const [data, setData] = useState()
  const [isFetching, setIsFetching] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    get()
  }, [userId])

  async function update (data, merge = true) {
    setIsUpdating(true)
    const profileResult = await updateProfile(fireInstance, userId, {
      data: data,
      merge: merge
    })
    setIsUpdating(false)
    return profileResult
  }

  async function get () {
    setIsFetching(true)
    const document = doc(getFirestore(fireInstance), collectionName, userId)
    const profileSnap = await getDoc(document)
    if (profileSnap.exists()) {
      setData(profileSnap.data())
    } else {
      setData()
    }
    setIsFetching(false)
  }

  return { isFetching, data, get, isUpdating, update }
}

export async function getProfile (userId, fireInstance) {
  const document = doc(getFirestore(fireInstance), collectionName, userId)
  try {
    const profileSnap = await getDoc(document)
    if (profileSnap.exists()) {
      return {
        data: profileSnap.data(),
        success: true
      }
    }
  } catch (ex) {
    let error = new FirebaseError()
    error = {
      ...error,
      ...ex
    }
    return {
      error: {
        ...error,
        message: "Couldn't set profile."
      }
    }
  }
}

export const useWidget = (fetchByDefault = true) => {
  const fireInstance = useFirebaseInstance()
  const { userId } = useSelector(state => state.user)
  const [isFetching, setIsFetching] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [data, setData] = useState()

  const document = doc(getFirestore(fireInstance), collectionName, userId)

  useEffect(() => {
    async function get () {
      setIsFetching(true)
      const widgetSnap = await getDoc(document)
      if (widgetSnap.exists()) {
        setData(widgetSnap.data().widget)
      } else {
        setData()
      }
      setIsFetching(false)
    }
    fetchByDefault && get()
  }, [userId])

  async function update (data, merge = true) {
    setIsUpdating(true)
    const profileResult = await updateProfile(fireInstance, userId, {
      data: {
        widget: {
          ...data
        }
      },
      merge: merge
    })
    setIsUpdating(false)
    return profileResult
  }
  return {
    isFetching,
    isUpdating,
    data,
    update
  }
  // return [isFetching, isUpdating, data, update]
}
