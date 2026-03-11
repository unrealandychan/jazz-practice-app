'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { JAZZ_STANDARDS, type JazzFeel, type Difficulty, type JazzStandard } from '@/data/standards'

const FEEL_LABELS: Record<JazzFeel, string> = {
  swing: 'Swing',
  bossa: 'Bossa Nova',
  ballad: 'Ballad',
  latin: 'Latin',
  waltz: 'Waltz',
  funk: 'Funk',
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'text-emerald-400',
  intermediate: 'text-amber-400',
  advanced: 'text-rose-400',
}

export default function StandardsPage() {
  const [search, setSearch] = useState('')
  const [feelFilter, setFeelFilter] = useState<JazzFeel | 'all'>('all')
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all')
  const [selected, setSelected] = useState<JazzStandard | null>(null)

  const filtered = JAZZ_STANDARDS.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.composer.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchFeel = feelFilter === 'all' || s.feel.includes(feelFilter)
    const matchDiff = diffFilter === 'all' || s.difficulty === diffFilter
    return matchSearch && matchFeel && matchDiff
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Jazz Standards Library</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        {JAZZ_STANDARDS.length} standards with chord progressions
      </p>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, composer, tag…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-[var(--muted-foreground)] self-center mr-1">Feel:</span>
        {(['all', 'swing', 'bossa', 'ballad', 'latin', 'waltz'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFeelFilter(f)}
            className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
              feelFilter === f
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {f === 'all' ? 'All' : FEEL_LABELS[f]}
          </button>
        ))}
        <span className="text-xs text-[var(--muted-foreground)] self-center ml-2 mr-1">Level:</span>
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDiffFilter(d)}
            className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
              diffFilter === d
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {d === 'all' ? 'All' : d}
          </button>
        ))}
      </div>

      <p className="text-xs text-[var(--muted-foreground)] mb-4">{filtered.length} results</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((standard) => (
          <button
            key={standard.id}
            onClick={() => setSelected(selected?.id === standard.id ? null : standard)}
            className={`text-left p-5 rounded-xl border transition-colors ${
              selected?.id === standard.id
                ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-[var(--foreground)] text-sm">{standard.title}</h3>
              <span
                className={`text-xs font-medium capitalize flex-shrink-0 ${DIFFICULTY_COLORS[standard.difficulty]}`}
              >
                {standard.difficulty}
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-2">
              {standard.composer} · {standard.year} ·{' '}
              <strong className="text-[var(--foreground)]">{standard.key}</strong>
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {standard.feel.map((f) => (
                <span
                  key={f}
                  className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
                >
                  {FEEL_LABELS[f]}
                </span>
              ))}
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                {standard.tempoRange[0]}–{standard.tempoRange[1]} BPM
              </span>
            </div>

            {selected?.id === standard.id && (
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  Chord Progression
                </p>
                <p className="font-mono text-sm text-[var(--foreground)] bg-[var(--muted)] rounded-lg p-3 leading-relaxed">
                  {standard.progression}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {standard.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
