'use client';

import { Clock, Flame, Music, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getSessions } from '@/services/sessions';
import type { IPracticeSession } from '@/types';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function calculateStreak(sessions: IPracticeSession[]): number {
  if (!sessions.length) return 0;
  const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let current = today;

  for (const date of dates) {
    if (date === current) {
      streak++;
      const d = new Date(current);
      d.setDate(d.getDate() - 1);
      current = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<IPracticeSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.date === today);
  const todayMinutes = todaySessions.reduce((a, s) => a + s.durationMinutes, 0);
  const totalMinutes = sessions.reduce((a, s) => a + s.durationMinutes, 0);
  const streak = calculateStreak(sessions);
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Today"
          value={loading ? '—' : formatDuration(todayMinutes)}
          sub={`${todaySessions.length} session${todaySessions.length !== 1 ? 's' : ''}`}
          icon={<Clock className="w-5 h-5" />}
          accent
        />
        <StatCard
          label="Streak"
          value={loading ? '—' : `${streak} day${streak !== 1 ? 's' : ''}`}
          sub={streak > 0 ? 'Keep it up!' : 'Start today'}
          icon={<Flame className="w-5 h-5" />}
        />
        <StatCard
          label="All Time"
          value={loading ? '—' : formatDuration(totalMinutes)}
          sub={`${sessions.length} sessions`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/sessions/new"
          className="flex items-center gap-4 p-5 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-[var(--accent-foreground)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              Log Practice Session
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Record what you practiced today
            </p>
          </div>
        </Link>

        <Link
          href="/metronome"
          className="flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-[var(--muted-foreground)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)]">Open Metronome</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Tap tempo, swing, time signature
            </p>
          </div>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Sessions</h2>
          <Link href="/sessions" className="text-sm text-[var(--accent)] hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-[var(--muted-foreground)] text-sm">Loading…</p>
        ) : recentSessions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl">
            <Music className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-3" />
            <p className="text-[var(--muted-foreground)]">
              No sessions yet. Log your first practice!
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {recentSessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)] capitalize">
                    {s.instrument}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {s.topics.join(' · ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--accent)]">
                    {formatDuration(s.durationMinutes)}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">{s.date}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-xl border ${
        accent
          ? 'border-[var(--accent)] bg-[var(--accent)]/10'
          : 'border-[var(--border)] bg-[var(--card)]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
          {label}
        </p>
        <span className={accent ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold text-[var(--foreground)]">{value}</p>
      <p className="text-xs text-[var(--muted-foreground)] mt-1">{sub}</p>
    </div>
  );
}
