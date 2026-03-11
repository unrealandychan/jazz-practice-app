'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuth, signInWithGoogle, signOut, migrateDeviceToUser } from '@/lib/auth'
import { createOrUpdateUserProfile } from '@/services/userProfile'
import { getDeviceId } from '@/lib/deviceId'
import type { UserProfile } from '@/types'

interface AuthContextValue {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: () => Promise<void>
  logOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const profile = await createOrUpdateUserProfile(firebaseUser)
          setUserProfile(profile)
        } catch (err) {
          console.error('Failed to load user profile:', err)
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signIn() {
    const deviceId = getDeviceId()
    const firebaseUser = await signInWithGoogle()
    // Migrate any anonymous sessions to the signed-in user
    await migrateDeviceToUser(firebaseUser.uid, deviceId)
    const profile = await createOrUpdateUserProfile(firebaseUser)
    setUser(firebaseUser)
    setUserProfile(profile)
  }

  async function logOut() {
    await signOut()
    setUser(null)
    setUserProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
