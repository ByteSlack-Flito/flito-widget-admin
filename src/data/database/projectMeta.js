import { FirebaseError } from 'firebase/app'
import {
  doc,
  addDoc,
  getFirestore,
  updateDoc,
  collection,
  getDoc
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useFirebaseInstance } from './users/auth'

const collectionName = `projectMeta`

export const useProjectMeta = () => {
  const fireInstance = useFirebaseInstance()
  const [isFetching, setIsFetching] = useState(false)
  const [data, setData] = useState()
  const [isUpdating, setIsUpdating] = useState(false)

  async function get (metaId) {
    setIsFetching(true)
    setData()
    try {
      const document = doc(getFirestore(fireInstance), collectionName, metaId)
      const result = await getDoc(document)
      console.log('Got data!', result.exists())
      setIsFetching(false)
      setData(result.data())
      return { data: {...result.data()}, success: true, }
    } catch (ex) {
      setIsFetching(false)
      let error = new FirebaseError()
      error = {
        ...error,
        ...ex
      }
      console.log('Error occured to get.')
      return {
        error: {
          ...error,
          message: "Couldn't read project-meta."
        }
      }
    }
  }

  async function update (metaId, data, merge = true) {
    setIsUpdating(true)
    try {
      console.log('Data came:', data)
      const document = doc(getFirestore(fireInstance), collectionName, metaId)
      await updateDoc(document, data, {
        merge
      })
      setIsUpdating(false)
      return { success: true }
    } catch (ex) {
      setIsUpdating(false)
      let error = new FirebaseError()
      error = {
        ...error,
        ...ex
      }
      return {
        error: {
          ...error,
          message: "Couldn't set project-meta."
        }
      }
    }
    // setIsUpdating(false)
    // return updateResult
  }

  return { isUpdating, isFetching, get, update, data }
}