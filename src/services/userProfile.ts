import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { IUserProfile } from '@/types';

const USERS_COLLECTION = 'users';

export async function createOrUpdateUserProfile(user: User): Promise<IUserProfile> {
  const ref = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // Update last seen
    const updated = { updatedAt: Date.now() };
    await updateDoc(ref, updated);
    return { ...snap.data(), ...updated } as IUserProfile;
  }

  // First sign-in — create profile
  const profile: IUserProfile = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? 'Jazz Musician',
    photoURL: user.photoURL,
    instruments: ['saxophone', 'guitar'],
    practiceGoalMinutes: 30,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(ref, profile);
  return profile;
}

export async function getUserProfile(uid: string): Promise<IUserProfile | null> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as IUserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<IUserProfile, 'displayName' | 'instruments' | 'practiceGoalMinutes'>>,
): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid);
  await updateDoc(ref, { ...data, updatedAt: Date.now() });
}
