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
  getDocs,
  deleteDoc
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCollection } from '../index.js'
import { useFirebaseInstance } from './auth.js'

const collectionName = `profiles`
const sub_collectionName = 'custom-services'

async function createService (fireInstance, profileID, { data, merge }) {
  if (!fireInstance) return

  const collection_ref = collection(
    getFirestore(fireInstance),
    collectionName,
    profileID,
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

async function updateService (
  fireInstance,
  profileID,
  serviceID,
  { data, merge }
) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    serviceID
  )
  try {
    let spread = { ...data }
    if (spread.uid) delete spread.uid

    const new_docRef = await setDoc(doc_ref, spread, {
      merge: merge
    })
    const new_doc = {
      ...data,
      uid: null
    }
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
        message: "Couldn't update the service."
      }
    }
  }
}
async function deleteService (fireInstance, profileID, serviceID) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    serviceID
  )
  try {
    await deleteDoc(doc_ref)
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
        message: "Couldn't delete the service."
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
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (userId) {
      if (serviceId) get()
      else getAll()
    }
  }, [userId, serviceId])

  async function get () {
    if (serviceId) {
      setIsFetching(true)
      const service_docRef = doc(
        getFirestore(fireInstance),
        collectionName,
        userId,
        sub_collectionName,
        serviceId
      )
      const service_doc = await getDoc(service_docRef)

      if (service_doc.exists()) {
        setDoc(service_doc.data())
      } else {
        setData()
      }
      setIsFetching(false)
    }
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

    if (collection_docs?.size > 0) {
      const all_docs = collection_docs.docs.map(x => ({
        ...x.data(),
        uid: x.id
      }))
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
  async function update (serviceID, data, merge = true) {
    setIsUpdating(true)
    const serviceResult = await updateService(fireInstance, userId, serviceID, {
      data: data,
      merge: merge
    })
    setIsUpdating(false)
    return serviceResult
  }
  async function _delete (serviceID) {
    setIsDeleting(true)
    const serviceResult = await deleteService(fireInstance, userId, serviceID)
    setIsDeleting(false)
    return serviceResult
  }

  return {
    data,
    isFetching,
    isUpdating,
    isDeleting,
    get,
    getAll,
    add,
    update,
    _delete
  }
}
