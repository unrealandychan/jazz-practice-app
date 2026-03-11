import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { getDeviceId } from '@/lib/deviceId';
import { auth, db } from '@/lib/firebase';
import { deleteMemo } from '@/services/audioMemos';
import type { IPracticeSession } from '@/types';

const SESSIONS_COLLECTION = 'sessions';

/** Returns the current user's UID, or falls back to device ID for anonymous use */
function getOwnerId(): string {
  return auth.currentUser?.uid ?? getDeviceId();
}

export async function addSession(
  session: Omit<IPracticeSession, 'id' | 'deviceId' | 'createdAt'>,
): Promise<string> {
  const deviceId = getOwnerId();
  const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
    ...session,
    deviceId,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function getSessions(): Promise<IPracticeSession[]> {
  const deviceId = getOwnerId();
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('deviceId', '==', deviceId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as IPracticeSession);
}

export async function deleteSession(id: string): Promise<void> {
  await deleteDoc(doc(db, SESSIONS_COLLECTION, id));
  // Best-effort: clean up the audio memo from Storage
  await deleteMemo(id).catch(() => {
    console.warn('Failed to delete associated audio memo for session', id);
  });
}

export async function updateSessionMemoUrl(id: string, audioMemoUrl: string): Promise<void> {
  await updateDoc(doc(db, SESSIONS_COLLECTION, id), { audioMemoUrl });
}

export async function getSessionsInRange(
  startDate: string,
  endDate: string,
): Promise<IPracticeSession[]> {
  const deviceId = getOwnerId();
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('deviceId', '==', deviceId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'asc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as IPracticeSession);
}
