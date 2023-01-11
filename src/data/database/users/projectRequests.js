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
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCollection } from '../index.js'
import { useFirebaseInstance } from './auth.js'

const collectionName = `profiles`
const sub_collectionName = 'project-requests'

async function updateProject (
  fireInstance,
  profileID,
  projectId,
  { data, merge }
) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    projectId
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
        message: "Couldn't update the project request."
      }
    }
  }
}

async function deleteService (fireInstance, profileID, projectId) {
  if (!fireInstance) return

  const doc_ref = doc(
    getFirestore(fireInstance),
    collectionName,
    profileID,
    sub_collectionName,
    projectId
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

export const useProjectRequest = preventFetch => {
  const fireInstance = useFirebaseInstance()
  const userId = useSelector(state => state?.user?.userId)
  const profile = useSelector(state => state?.user?.profile)
  const [data, setData] = useState()
  const [isFetching, setIsFetching] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (userId) {
      if (!preventFetch) {
        getAll()
      }
    }
  }, [userId, preventFetch])

  useEffect(() => {
    profile?.onboard_complete && getAll()
  }, [profile?.onboard_complete])

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

  async function _delete (projectId) {
    setIsDeleting(true)
    const serviceResult = await deleteService(fireInstance, userId, projectId)
    setIsDeleting(false)

    if(serviceResult.success){
      setData(prev => {
        if(Array.isArray(prev)){
          const spread = [...prev]
          const delIndex = spread.findIndex(x => x.uid === projectId)
          if(delIndex >= 0){
            spread.splice(delIndex, 1)
          }
          return spread
        }
      })
    }
    return serviceResult
  }

  async function update (projectId, data, merge = true) {
    setIsUpdating(true)
    const result = await updateProject(fireInstance, userId, projectId, {
      data: data,
      merge: merge
    })
    setIsUpdating(false)

    if (result.success) {
      setData(prev => {
        if (Array.isArray(prev)) {
          const spread = [...prev]
          const updIndex = spread.findIndex(x => x.uid === projectId)
          if (updIndex >= 0) {
            const updated = {
              ...spread[updIndex],
              ...data
            }
            spread[updIndex] = updated
            return spread
          }
        }
      })
    }
    return result
  }

  return {
    data,
    isFetching,
    isUpdating,
    isDeleting,
    getAll,
    update,
    _delete
  }
}
