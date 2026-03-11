import {
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';

import { auth, db } from './firebase';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

/** Cookie key read by Next.js middleware for fast server-side auth check */
export const AUTH_COOKIE = 'jazz_auth_session';

export function setAuthCookie(uid: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  document.cookie = `${AUTH_COOKIE}=${uid}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`;
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, provider);
  setAuthCookie(result.user.uid);
  return result.user;
}

export async function signOut(): Promise<void> {
  clearAuthCookie();
  await firebaseSignOut(auth);
}

export function onAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Migrate all Firestore documents owned by the given deviceId to the user's UID.
 * Called on first sign-in so existing anonymous data is preserved.
 */
export async function migrateDeviceToUser(uid: string, deviceId: string): Promise<void> {
  if (!deviceId || deviceId === uid || deviceId === 'ssr') return;
  const collectionsToMigrate = ['sessions'];
  for (const col of collectionsToMigrate) {
    const q = query(collection(db, col), where('deviceId', '==', deviceId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) continue;
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.update(doc(db, col, d.id), { deviceId: uid }));
    await batch.commit();
  }
  localStorage.setItem('jazz_device_id', uid);
}
