import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getDeviceId } from '@/lib/deviceId'
import type { PracticeSession } from '@/types'

const SESSIONS_COLLECTION = 'sessions'

export async function addSession(
  session: Omit<PracticeSession, 'id' | 'deviceId' | 'createdAt'>
): Promise<string> {
  const deviceId = getDeviceId()
  const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
    ...session,
    deviceId,
    createdAt: Date.now(),
  })
  return docRef.id
}

export async function getSessions(): Promise<PracticeSession[]> {
  const deviceId = getDeviceId()
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('deviceId', '==', deviceId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PracticeSession))
}

export async function deleteSession(id: string): Promise<void> {
  await deleteDoc(doc(db, SESSIONS_COLLECTION, id))
}

export async function getSessionsInRange(
  startDate: string,
  endDate: string
): Promise<PracticeSession[]> {
  const deviceId = getDeviceId()
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('deviceId', '==', deviceId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PracticeSession))
}
