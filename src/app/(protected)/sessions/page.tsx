'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Music } from 'lucide-react'
import { getSessions, deleteSession } from '@/services/sessions'
import type { PracticeSession, Instrument } from '@/types'

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const INSTRUMENT_LABELS: Record<Instrument, string> = {
  guitar: 'Guitar',
  saxophone: 'Saxophone',
  piano: 'Piano',
  other: 'Other',
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Instrument | 'all'>('all')

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? sessions : sessions.filter((s) => s.instrument === filter)

  async function handleDelete(id: string) {
    if (!confirm('Delete this session?')) return
    await deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Practice Sessions</h1>
          <p className="text-[var(--muted-foreground)] mt-1">{sessions.length} sessions total</p>
        </div>
        <Link
          href="/sessions/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Session
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'guitar', 'saxophone', 'piano', 'other'] as const).map((val) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filter === val
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {val === 'all' ? 'All' : INSTRUMENT_LABELS[val as Instrument]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--muted-foreground)] text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-xl">
          <Music className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-3" />
          <p className="text-[var(--muted-foreground)]">No sessions found.</p>
          <Link
            href="/sessions/new"
            className="text-sm text-[var(--accent)] hover:underline mt-2 inline-block"
          >
            Log your first session →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-[var(--foreground)] capitalize">
                    {INSTRUMENT_LABELS[s.instrument]}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                    {s.date}
                  </span>
                  {s.bpm && (
                    <span className="text-xs text-[var(--muted-foreground)]">{s.bpm} BPM</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {s.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)] capitalize"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {s.notes && (
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {s.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 ml-4">
                <p className="text-lg font-bold text-[var(--accent)]">
                  {formatDuration(s.durationMinutes)}
                </p>
                <button
                  onClick={() => s.id && handleDelete(s.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                  aria-label="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
