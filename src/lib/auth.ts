/**
 * Auth scaffold — Google Sign-In is configured but NOT surfaced in the UI yet.
 * To enable auth: import signIn / signOut in the nav and remove the `hidden` flag.
 * After sign-in, call migrateDeviceToUser() to move Firestore data to the user's UID.
 */
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { getDeviceId } from './deviceId'

const provider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export function onAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

/**
 * Migrate all Firestore documents owned by the current deviceId to the authenticated user's UID.
 * Call this immediately after a successful sign-in.
 */
export async function migrateDeviceToUser(uid: string): Promise<void> {
  const deviceId = getDeviceId()
  const collectionsToMigrate = ['sessions']

  for (const col of collectionsToMigrate) {
    const q = query(collection(db, col), where('deviceId', '==', deviceId))
    const snapshot = await getDocs(q)

    if (snapshot.empty) continue

    const batch = writeBatch(db)
    snapshot.docs.forEach((docSnap) => {
      batch.update(doc(db, col, docSnap.id), { deviceId: uid })
    })
    await batch.commit()
  }

  // Update the local device ID to the user's UID so future writes use UID
  localStorage.setItem('jazz_device_id', uid)
}
