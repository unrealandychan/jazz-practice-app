'use client';

import { Pause, Play, Save, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { addSession } from '@/services/sessions';
import { useSessionTimer } from '@/store/sessionTimer';
import type { Instrument, PracticeTopic } from '@/types';

const INSTRUMENTS: { value: Instrument; label: string; emoji: string }[] = [
  { value: 'guitar', label: 'Guitar', emoji: '🎸' },
  { value: 'saxophone', label: 'Saxophone', emoji: '🎷' },
  { value: 'piano', label: 'Piano', emoji: '🎹' },
  { value: 'other', label: 'Other', emoji: '🎵' },
];

const TOPICS: { value: PracticeTopic; label: string }[] = [
  { value: 'scales', label: 'Scales' },
  { value: 'ii-V-I', label: 'ii-V-I' },
  { value: 'standards', label: 'Standards' },
  { value: 'improvisation', label: 'Improvisation' },
  { value: 'technique', label: 'Technique' },
  { value: 'rhythm', label: 'Rhythm' },
  { value: 'ear-training', label: 'Ear Training' },
  { value: 'chords', label: 'Chords' },
  { value: 'sight-reading', label: 'Sight Reading' },
  { value: 'repertoire', label: 'Repertoire' },
];

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function NewSessionPage() {
  const router = useRouter();
  const { state, elapsedSeconds, start, pause, resume, stop, reset, tick } = useSessionTimer();

  const [instrument, setInstrument] = useState<Instrument>('saxophone');
  const [topics, setTopics] = useState<PracticeTopic[]>([]);
  const [notes, setNotes] = useState('');
  const [bpm, setBpm] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [useTimer, setUseTimer] = useState(true);
  const [saving, setSaving] = useState(false);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state === 'running') {
      tickRef.current = setInterval(tick, 1000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state, tick]);

  // Clean up timer on unmount
  useEffect(
    () => () => {
      reset();
    },
    [reset],
  );

  function toggleTopic(topic: PracticeTopic) {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }

  async function handleSave() {
    const durationMinutes = useTimer
      ? Math.max(1, Math.round(elapsedSeconds / 60))
      : parseInt(manualMinutes, 10);

    if (!durationMinutes || durationMinutes < 1) {
      alert('Please record at least 1 minute of practice.');
      return;
    }
    if (topics.length === 0) {
      alert('Select at least one topic.');
      return;
    }

    setSaving(true);
    try {
      if (state === 'running') stop();
      await addSession({
        instrument,
        durationMinutes,
        topics,
        notes,
        bpm: bpm ? parseInt(bpm, 10) : undefined,
        date: new Date().toISOString().split('T')[0],
      });
      reset();
      router.push('/sessions');
    } catch (err) {
      console.error(err);
      alert('Failed to save session. Check your Firebase config.');
    } finally {
      setSaving(false);
    }
  }

  const canSave =
    topics.length > 0 && (useTimer ? elapsedSeconds > 0 : parseInt(manualMinutes) > 0);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">Log Practice Session</h1>

      {/* Instrument */}
      <section className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
          Instrument
        </label>
        <div className="grid grid-cols-4 gap-3">
          {INSTRUMENTS.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => setInstrument(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-colors ${
                instrument === value
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]'
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Timer */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Duration
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUseTimer(true)}
              className={`text-xs px-3 py-1 rounded-full ${useTimer ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
            >
              Timer
            </button>
            <button
              onClick={() => setUseTimer(false)}
              className={`text-xs px-3 py-1 rounded-full ${!useTimer ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
            >
              Manual
            </button>
          </div>
        </div>

        {useTimer ? (
          <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <div className="text-6xl font-mono font-bold text-[var(--foreground)] tabular-nums">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="flex gap-3">
              {state === 'idle' && (
                <button
                  onClick={start}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] font-medium hover:opacity-90"
                >
                  <Play className="w-4 h-4" /> Start
                </button>
              )}
              {state === 'running' && (
                <>
                  <button
                    onClick={pause}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-medium"
                  >
                    <Pause className="w-4 h-4" /> Pause
                  </button>
                  <button
                    onClick={stop}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-medium"
                  >
                    <Square className="w-4 h-4" /> Stop
                  </button>
                </>
              )}
              {state === 'paused' && (
                <>
                  <button
                    onClick={resume}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
                  >
                    <Play className="w-4 h-4" /> Resume
                  </button>
                  <button
                    onClick={stop}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--muted)] text-[var(--foreground)] font-medium"
                  >
                    <Square className="w-4 h-4" /> Stop
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="480"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(e.target.value)}
              placeholder="60"
              className="w-28 px-4 py-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
            <span className="text-[var(--muted-foreground)] text-sm">minutes</span>
          </div>
        )}
      </section>

      {/* Topics */}
      <section className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
          Topics <span className="normal-case font-normal">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleTopic(value)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                topics.includes(value)
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* BPM */}
      <section className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
          Tempo <span className="normal-case font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="20"
            max="320"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            placeholder="120"
            className="w-28 px-4 py-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <span className="text-[var(--muted-foreground)] text-sm">BPM</span>
        </div>
      </section>

      {/* Notes */}
      <section className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
          Notes <span className="normal-case font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you work on? Any breakthroughs or things to revisit?"
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)] resize-none placeholder:text-[var(--muted-foreground)]"
        />
      </section>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        className="flex items-center gap-2 w-full justify-center py-3 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving…' : 'Save Session'}
      </button>
    </div>
  );
}
