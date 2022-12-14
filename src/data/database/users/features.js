import { FirebaseError } from 'firebase/app'
import { Timestamp } from 'firebase/firestore'
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  getFirestore,
  writeBatch,
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
const sub_collectionName = 'custom-features'

async function createFeature (
  fireInstance,
  profileID,
  { data, merge, isMultiple }
) {
  if (!fireInstance) return

  const collection_ref = collection(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName
  )
  try {
    if (!isMultiple) {
      const new_docRef = await addDoc(collection_ref, data, {
        merge: merge
      })
      const new_doc = (await getDoc(new_docRef))?.data()

      return { success: true, data: new_doc }
    } else {
      const batch = writeBatch(getFirestore(fireInstance))
      data?.map(single => {
        const new_docRef = doc(collection_ref)
        batch.set(new_docRef, { ...single, createdAt: Timestamp.now() })
      })

      await batch.commit()
      return { success: true }
    }
  } catch (ex) {
    let error = new FirebaseError()
    console.log('Error is:', ex)
    error = {
      ...error,
      ...ex
    }
    return {
      error: {
        ...error,
        message: "Couldn't create/set feature data."
      }
    }
  }
}

async function updateFeature (
  fireInstance,
  profileID,
  featureId,
  { data, merge }
) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    featureId
  )
  try {
    let spread = { ...data }
    if (spread.uid) delete spread.uid

    await setDoc(doc_ref, spread, {
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
        message: "Couldn't update the feature."
      }
    }
  }
}
async function deleteFeature (fireInstance, profileID, featureID) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    featureID
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

export const useFeaturesHook = (featureId, preventFetch = false) => {
  const fireInstance = useFirebaseInstance()
  const userId = useSelector(state => state?.user?.userId)
  const [data, setData] = useState()
  const [isFetching, setIsFetching] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (userId && !preventFetch) {
      if (featureId) get()
      else getAll()
    }
  }, [userId, featureId])

  async function get () {
    if (featureId) {
      setIsFetching(true)
      const feature_docRef = doc(
        getFirestore(fireInstance),
        collectionName,
        userId,
        sub_collectionName,
        featureId
      )
      const feature_doc = await getDoc(feature_docRef)

      if (feature_doc.exists()) {
        setDoc(feature_doc.data())
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
    const featureResult = await createFeature(fireInstance, userId, {
      data: { ...data, createdAt: Timestamp.now() },
      merge: merge
    })
    setIsUpdating(false)
    return featureResult
  }

  async function addMultiple (data, merge = true) {
    setIsUpdating(true)
    const featureResult = await createFeature(fireInstance, userId, {
      data: data,
      isMultiple: true
    })
    setIsUpdating(false)
    return featureResult
  }

  async function update (featureId, data, merge = true) {
    setIsUpdating(true)
    const featureResult = await updateFeature(fireInstance, userId, featureId, {
      data: data,
      merge: merge
    })
    setIsUpdating(false)
    return featureResult
  }
  async function _delete (featureId) {
    setIsDeleting(true)
    const featureResult = await deleteFeature(fireInstance, userId, featureId)
    setIsDeleting(false)
    return featureResult
  }

  return {
    data,
    isFetching,
    isUpdating,
    isDeleting,
    get,
    getAll,
    add,
    addMultiple,
    update,
    _delete
  }
}
