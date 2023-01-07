import { FirebaseError } from 'firebase/app'
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
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCollection } from '../index.js'
import { useFirebaseInstance } from './auth.js'

const collectionName = `profiles`
const sub_collectionName = 'service-bundles'

async function createbundle (
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
        batch.set(new_docRef, single)
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
        message: "Couldn't create/set bundle data."
      }
    }
  }
}

async function updatebundle (
  fireInstance,
  profileID,
  bundleId,
  { data, merge }
) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    bundleId
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
        message: "Couldn't update the bundle."
      }
    }
  }
}
async function deletebundle (fireInstance, profileID, bundleId) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    bundleId
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

export const useBundlesHook = (bundleId, preventFetch = false) => {
  const fireInstance = useFirebaseInstance()
  const userId = useSelector(state => state?.user?.userId)
  const [data, setData] = useState()
  const [isFetching, setIsFetching] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (userId && !preventFetch) {
      if (bundleId) get()
      else getAll()
    }
  }, [userId, bundleId])

  async function get () {
    if (bundleId) {
      setIsFetching(true)
      const bundle_docRef = doc(
        getFirestore(fireInstance),
        collectionName,
        userId,
        sub_collectionName,
        bundleId
      )
      const bundle_doc = await getDoc(bundle_docRef)

      if (bundle_doc.exists()) {
        setDoc(bundle_doc.data())
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
    const bundleResult = await createbundle(fireInstance, userId, {
      data: {...data, createdAt: Timestamp.now()},
      merge: merge
    })
    setIsUpdating(false)
    return bundleResult
  }

  async function addMultiple (data, merge = true) {
    setIsUpdating(true)
    const bundleResult = await createbundle(fireInstance, userId, {
      data: data,
      isMultiple: true
    })
    setIsUpdating(false)
    return bundleResult
  }

  async function update (bundleId, data, merge = true) {
    setIsUpdating(true)
    const bundleResult = await updatebundle(fireInstance, userId, bundleId, {
      data: data,
      merge: merge
    })
    setIsUpdating(false)
    return bundleResult
  }
  async function _delete (bundleId) {
    setIsDeleting(true)
    const bundleResult = await deletebundle(fireInstance, userId, bundleId)
    setIsDeleting(false)
    return bundleResult
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
