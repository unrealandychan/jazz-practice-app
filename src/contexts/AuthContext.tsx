'use client';

import type { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { migrateDeviceToUser, onAuth, signInWithGoogle, signOut } from '@/lib/auth';
import { getDeviceId } from '@/lib/deviceId';
import { createOrUpdateUserProfile } from '@/services/userProfile';
import type { IUserProfile } from '@/types';

interface IAuthContextValue {
  user: User | null;
  userProfile: IUserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = async (): Promise<void> => {};
const AuthContext = createContext<IAuthContextValue>({
  user: null,
  userProfile: null,
  loading: true,
  signIn: noop,
  logOut: noop,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await createOrUpdateUserProfile(firebaseUser);
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to load user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signIn() {
    const deviceId = getDeviceId();
    const firebaseUser = await signInWithGoogle();
    // Migrate any anonymous sessions to the signed-in user
    await migrateDeviceToUser(firebaseUser.uid, deviceId);
    const profile = await createOrUpdateUserProfile(firebaseUser);
    setUser(firebaseUser);
    setUserProfile(profile);
  }

  async function logOut() {
    await signOut();
    setUser(null);
    setUserProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
