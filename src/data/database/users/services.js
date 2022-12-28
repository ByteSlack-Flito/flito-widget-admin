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
  arrayRemove,
  collection,
  getDocs
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCollection } from '../index.js'
import { useFirebaseInstance } from './auth.js'

const collectionName = `profiles`
const sub_collectionName = 'custom-services'

async function createService (fireInstance, uid, { data, merge }) {
  if (!fireInstance) return

  const collection_ref = collection(
    getFirestore(fireInstance),
    collectionName,
    uid,
    sub_collectionName
  )
  try {
    const new_docRef = await addDoc(collection_ref, data, {
      merge: merge
    })
    const new_doc = (await getDoc(new_docRef))?.data()
    return { success: true, data: new_doc }
  } catch (ex) {
    let error = new FirebaseError()
    error = {
      ...error,
      ...ex
    }
    return {
      error: {
        ...error,
        message: "Couldn't create/set service data."
      }
    }
  }
}

export const useMicroServices = (serviceId, preventFetch) => {
  const fireInstance = useFirebaseInstance()
  const { userId } = useSelector(state => state.user)
  const [data, setData] = useState()
  const [isFetching, setIsFetching] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (userId) {
      if (serviceId) get()
      else getAll()
    }
  }, [userId, serviceId])

  async function get () {
    setIsFetching(true)
    const service_docRef = document(
      getFirestore(fireInstance),
      collectionName,
      userId,
      sub_collectionName
    )
    const service_doc = await getDoc(service_docRef)

    if (service_doc.exists()) {
      setDoc(service_doc.data())
    } else {
      setData()
    }
    setIsFetching(false)
  }
  async function getAll () {
    setIsFetching(true)
    const collectionRef = collection(
      getFirestore(fireInstance),
      collectionName,
      userId,
      sub_collectionName
    )
    const collection_docs = await getDocs(collectionRef)

    if (collection_docs.size > 0) {
      const all_docs = collection_docs.docs.map(x => x.data())
      setData(all_docs)
    } else {
      setData()
    }
    setIsFetching(false)
  }

  async function add (data, merge = true) {
    setIsUpdating(true)
    const serviceResult = await createService(fireInstance, userId, {
      data: data,
      merge: merge
    })
    setIsUpdating(false)
    return serviceResult
  }

  return { isFetching, data, get, isUpdating, add }
}
