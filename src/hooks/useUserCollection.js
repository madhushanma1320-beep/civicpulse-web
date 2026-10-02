import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

// Real-time CRUD for any Firestore collection, limited to the logged-in user's documents
export function useUserCollection(collectionName) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const q = query(collection(db, collectionName), where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        list.sort(
          (a, b) =>
            (b.createdAt?.toMillis() ?? Date.now()) -
            (a.createdAt?.toMillis() ?? Date.now()),
        )
        setItems(list)
        setLoading(false)
      },
      (err) => {
        console.error(err)
        setError('Could not load your data. Please try again.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [collectionName, user.uid])

  const addItem = (data) =>
    addDoc(collection(db, collectionName), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
    })

  const updateItem = (id, data) =>
    updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() })

  const deleteItem = (id) => deleteDoc(doc(db, collectionName, id))

  return { items, loading, error, addItem, updateItem, deleteItem }
}