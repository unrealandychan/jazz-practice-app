'use client'

import { useState } from 'react'
import { SCALES, ROOTS, NOTE_NAMES, getScaleNotes, type Scale } from '@/data/scales'

const ROOT_SIMPLE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function ScalesPage() {
  const [root, setRoot] = useState('C')
  const [selected, setSelected] = useState<Scale>(SCALES[0])

  const notes = getScaleNotes(root, selected.intervals)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Scales &amp; Modes</h1>
      <p className="text-[var(--muted-foreground)] mb-8">
        Jazz scale reference for all instruments.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scale list */}
        <div className="lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Scale Type
          </p>
          <ul className="space-y-1">
            {SCALES.map((scale) => (
              <li key={scale.type}>
                <button
                  onClick={() => setSelected(scale)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selected.type === scale.type
                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {scale.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {/* Root selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
              Root Note
            </p>
            <div className="flex flex-wrap gap-2">
              {ROOT_SIMPLE.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoot(r)}
                  className={`w-10 h-10 rounded-lg text-sm font-mono font-semibold transition-colors ${
                    root === r
                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Scale info */}
          <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
              {root} {selected.name}
            </h2>
            <p className="text-[var(--muted-foreground)] text-sm mb-4">{selected.description}</p>

            {/* Notes */}
            <div className="flex flex-wrap gap-2 mb-4">
              {notes.map((note, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                        : 'bg-[var(--muted)] text-[var(--foreground)]'
                    }`}
                  >
                    {note}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] mt-1">
                    {selected.degrees[i]}
                  </span>
                </div>
              ))}
            </div>

            {/* Piano keyboard visualization */}
            <PianoKeyboard notes={notes} root={root} />
          </div>

          {/* Jazz context */}
          <div className="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-1">
              Jazz Context
            </p>
            <p className="text-sm text-[var(--foreground)]">{selected.jazzContext}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PianoKeyboard({ notes, root }: { notes: string[]; root: string }) {
  const octaveKeys = [
    { note: 'C', isBlack: false, offset: 0 },
    { note: 'C#', isBlack: true, offset: 1 },
    { note: 'D', isBlack: false, offset: 2 },
    { note: 'D#', isBlack: true, offset: 3 },
    { note: 'E', isBlack: false, offset: 4 },
    { note: 'F', isBlack: false, offset: 5 },
    { note: 'F#', isBlack: true, offset: 6 },
    { note: 'G', isBlack: false, offset: 7 },
    { note: 'G#', isBlack: true, offset: 8 },
    { note: 'A', isBlack: false, offset: 9 },
    { note: 'A#', isBlack: true, offset: 10 },
    { note: 'B', isBlack: false, offset: 11 },
  ]

  const whiteKeys = octaveKeys.filter((k) => !k.isBlack)

  return (
    <div className="mt-4">
      <p className="text-xs text-[var(--muted-foreground)] mb-2">Keyboard</p>
      <div className="relative" style={{ height: 80, width: whiteKeys.length * 32 }}>
        {/* White keys */}
        {whiteKeys.map((key, i) => {
          const inScale = notes.includes(key.note)
          const isRoot = key.note === root
          return (
            <div
              key={key.note}
              className={`absolute border border-[var(--border)] rounded-b-md transition-colors ${
                isRoot ? 'bg-[var(--accent)]' : inScale ? 'bg-white/20' : 'bg-[var(--muted)]'
              }`}
              style={{ left: i * 32, width: 30, top: 0, height: 80 }}
            />
          )
        })}
        {/* Black keys */}
        {octaveKeys
          .filter((k) => k.isBlack)
          .map((key) => {
            const whiteIndex = whiteKeys.findIndex((w) => {
              const wOffset = w.offset
              return key.offset === wOffset + 1
            })
            const inScale = notes.includes(key.note)
            const isRoot = key.note === root
            return (
              <div
                key={key.note}
                className={`absolute z-10 rounded-b-sm ${
                  isRoot ? 'bg-[var(--accent)]' : inScale ? 'bg-zinc-500' : 'bg-zinc-800'
                }`}
                style={{
                  left: whiteIndex * 32 + 20,
                  width: 20,
                  top: 0,
                  height: 50,
                }}
              />
            )
          })}
      </div>
    </div>
  )
}
