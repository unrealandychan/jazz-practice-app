'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Music } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleSignIn() {
    setLoading(true)
    setError('')
    try {
      await signIn()
      const from = searchParams.get('from') ?? '/dashboard'
      router.push(from)
    } catch (err) {
      setError('Sign-in failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm">
        {/* Back to landing */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <Music className="w-4 h-4 text-[var(--accent-foreground)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              Jazz Practice
            </span>
          </Link>
        </div>

        <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-[var(--foreground)]">Welcome back</h1>
            <p className="text-[var(--muted-foreground)] mt-2 text-sm">
              Sign in to sync your practice sessions across all devices
            </p>
          </div>

          {error && (
            <p className="text-sm text-[var(--destructive)] mb-4 text-center bg-[var(--destructive)]/10 py-2 px-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="text-xs text-[var(--muted-foreground)] text-center mt-6">
            Your existing practice data will be migrated automatically.
          </p>
        </div>

        <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
          Built by <span className="text-[var(--foreground)] font-medium">Eddie Chan</span>
        </p>
      </div>
    </div>
  )
}
