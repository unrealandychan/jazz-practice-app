'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { getSessions } from '@/services/sessions'
import type { PracticeSession, Instrument, PracticeTopic } from '@/types'

const INSTRUMENT_COLORS: Record<Instrument, string> = {
  guitar: '#c9a84c',
  saxophone: '#6c8ebf',
  piano: '#82ca9d',
  other: '#888',
}

function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })
}

function calculateStreak(sessions: PracticeSession[]): number {
  if (!sessions.length) return 0
  const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  let streak = 0
  let current = today
  for (const date of dates) {
    if (date === current) {
      streak++
      const d = new Date(current)
      d.setDate(d.getDate() - 1)
      current = d.toISOString().split('T')[0]
    } else break
  }
  return streak
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const last30 = getLast30Days()
  const sessionMap = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.date] = (acc[s.date] ?? 0) + s.durationMinutes
    return acc
  }, {})

  const chartData = last30.map((date) => ({
    date: date.slice(5), // MM-DD
    minutes: sessionMap[date] ?? 0,
  }))

  // Instrument breakdown
  const instrumentData = Object.entries(
    sessions.reduce<Record<string, number>>((acc, s) => {
      acc[s.instrument] = (acc[s.instrument] ?? 0) + s.durationMinutes
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Topic breakdown
  const topicData = Object.entries(
    sessions.reduce<Record<string, number>>((acc, s) => {
      s.topics.forEach((t) => {
        acc[t] = (acc[t] ?? 0) + s.durationMinutes
      })
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  const totalMinutes = sessions.reduce((a, s) => a + s.durationMinutes, 0)
  const streak = calculateStreak(sessions)
  const avgSessionMinutes = sessions.length ? Math.round(totalMinutes / sessions.length) : 0

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-[var(--muted-foreground)]">Loading…</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">Progress</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Time', value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` },
          { label: 'Sessions', value: sessions.length.toString() },
          { label: 'Day Streak', value: `${streak} days` },
          { label: 'Avg Session', value: `${avgSessionMinutes}m` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]"
          >
            <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
              {label}
            </p>
            <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-xl">
          <p className="text-[var(--muted-foreground)]">
            No data yet. Log some practice sessions to see your progress!
          </p>
        </div>
      ) : (
        <>
          {/* Daily practice chart */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Daily Practice (Last 30 Days)
            </h2>
            <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                    interval={4}
                  />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} unit="m" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--foreground)',
                    }}
                    formatter={(val) => [`${val} min`, 'Practice']}
                  />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={(props) => {
                      if ((props.payload as { minutes: number }).minutes > 0) {
                        return (
                          <circle
                            key={props.key}
                            cx={props.cx}
                            cy={props.cy}
                            r={3}
                            fill="var(--accent)"
                          />
                        )
                      }
                      return <g key={props.key} />
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instrument */}
            {instrumentData.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  By Instrument
                </h2>
                <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={instrumentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {instrumentData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={INSTRUMENT_COLORS[entry.name as Instrument] ?? '#888'}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground)',
                        }}
                        formatter={(val) => [`${val} min`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Topics */}
            {topicData.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">By Topic</h2>
                <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                  <ul className="space-y-3">
                    {topicData.map(({ name, value }) => {
                      const pct = Math.round((value / totalMinutes) * 100)
                      return (
                        <li key={name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[var(--foreground)] capitalize">{name}</span>
                            <span className="text-[var(--muted-foreground)]">{value}m</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--muted)]">
                            <div
                              className="h-1.5 rounded-full bg-[var(--accent)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
