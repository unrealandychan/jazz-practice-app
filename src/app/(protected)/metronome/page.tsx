'use client';

import { Minus, Play, Plus, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Sequence } from 'tone';

import { type SwingFeel, useMetronome } from '@/store/metronome';

// Tone.js is dynamically imported to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Tone: any | null = null;

const SWING_LABELS: Record<SwingFeel, string> = {
  straight: 'Straight',
  light: 'Light Swing',
  heavy: 'Heavy Swing',
};

const SWING_RATIOS: Record<SwingFeel, number> = {
  straight: 0.5,
  light: 0.6,
  heavy: 0.67,
};

const TIME_SIGNATURES = [2, 3, 4, 5, 6, 7];

export default function MetronomePage() {
  const {
    bpm,
    isPlaying,
    timeSignature,
    swing,
    currentBeat,
    setBpm,
    setTimeSignature,
    setSwing,
    setPlaying,
    setCurrentBeat,
  } = useMetronome();

  const [toneLoaded, setToneLoaded] = useState(false);
  const sequenceRef = useRef<Sequence | null>(null);
  const tapTimesRef = useRef<number[]>([]);

  // Load Tone.js on client only
  useEffect(() => {
    import('tone').then((t) => {
      Tone = t;
      setToneLoaded(true);
    });
  }, []);

  const stopMetronome = useCallback(() => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    Tone?.getTransport().stop();
    setPlaying(false);
    setCurrentBeat(0);
  }, [setPlaying, setCurrentBeat]);

  const startMetronome = useCallback(async () => {
    if (!Tone) return;
    await Tone.start();

    const transport = Tone.getTransport();
    transport.bpm.value = bpm;

    const beats = Array.from({ length: timeSignature }, (_, i) => i);

    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();

    const accentSynth = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 6,
      envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.1 },
    }).toDestination();

    const _swingRatio = SWING_RATIOS[swing];

    let _beatIndex = 0;
    const seq = new Tone.Sequence(
      (time: string, beat: number | string) => {
        const s = beat === 0 ? accentSynth : synth;
        s.triggerAttackRelease(beat === 0 ? 'C2' : 'C3', '32n', time);
        // Swing: delay the "and" (off-beat) of every beat
        Tone!.getDraw().schedule(() => {
          setCurrentBeat(beat as number);
        }, time);
        _beatIndex++;
      },
      beats,
      // Swing timing: use 8n subdivision and offset odd beats
      '4n',
    );

    seq.start(0);
    transport.start();
    sequenceRef.current = seq;
    setPlaying(true);
  }, [bpm, timeSignature, swing, setPlaying, setCurrentBeat]);

  // Stop when component unmounts
  useEffect(
    () => () => {
      stopMetronome();
    },
    [stopMetronome],
  );

  // Restart if bpm/timeSignature/swing changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      // Small delay to let stop propagate
      setTimeout(() => startMetronome(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, timeSignature, swing]);

  function handleTap() {
    const now = Date.now();
    tapTimesRef.current.push(now);

    // Only use last 8 taps
    if (tapTimesRef.current.length > 8) {
      tapTimesRef.current = tapTimesRef.current.slice(-8);
    }

    if (tapTimesRef.current.length >= 2) {
      const intervals = tapTimesRef.current.slice(1).map((t, i) => t - tapTimesRef.current[i]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const tappedBpm = Math.round(60000 / avg);
      setBpm(tappedBpm);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">Metronome</h1>

      {/* Beat visualizer */}
      <div className="flex justify-center gap-3 mb-10">
        {Array.from({ length: timeSignature }, (_, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-75 flex items-center justify-center text-xs font-bold ${
              isPlaying && currentBeat === i
                ? i === 0
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] scale-110'
                  : 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] scale-110'
                : 'border-[var(--border)] text-[var(--muted-foreground)]'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* BPM */}
      <div className="text-center mb-8">
        <p className="text-8xl font-bold text-[var(--foreground)] tabular-nums">{bpm}</p>
        <p className="text-[var(--muted-foreground)] mt-1 text-sm">BPM</p>
        <input
          type="range"
          min={20}
          max={320}
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="w-full mt-6 accent-[var(--accent)]"
        />
        <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
          <span>20</span>
          <span>320</span>
        </div>
      </div>

      {/* BPM +/- */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setBpm(bpm - 5)}
          className="w-12 h-12 rounded-full bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setBpm(bpm - 1)}
          className="w-10 h-10 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center hover:bg-[var(--border)] transition-colors text-sm"
        >
          -1
        </button>
        <button
          onClick={() => setBpm(bpm + 1)}
          className="w-10 h-10 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center hover:bg-[var(--border)] transition-colors text-sm"
        >
          +1
        </button>
        <button
          onClick={() => setBpm(bpm + 5)}
          className="w-12 h-12 rounded-full bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Play / Stop */}
      <div className="flex gap-4 justify-center mb-10">
        {!isPlaying ? (
          <button
            onClick={startMetronome}
            disabled={!toneLoaded}
            className="flex items-center gap-3 px-10 py-4 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            <Play className="w-5 h-5" /> Play
          </button>
        ) : (
          <button
            onClick={stopMetronome}
            className="flex items-center gap-3 px-10 py-4 rounded-xl bg-[var(--muted)] text-[var(--foreground)] font-semibold text-lg hover:bg-[var(--border)]"
          >
            <Square className="w-5 h-5" /> Stop
          </button>
        )}
        <button
          onClick={handleTap}
          className="px-8 py-4 rounded-xl bg-[var(--muted)] text-[var(--foreground)] font-semibold hover:bg-[var(--border)] active:scale-95 transition-all"
        >
          Tap
        </button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-6">
        {/* Time signature */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Time Signature
          </label>
          <div className="flex flex-wrap gap-2">
            {TIME_SIGNATURES.map((ts) => (
              <button
                key={ts}
                onClick={() => setTimeSignature(ts)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                  timeSignature === ts
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                }`}
              >
                {ts}/4
              </button>
            ))}
          </div>
        </div>

        {/* Swing */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Swing Feel
          </label>
          <div className="flex flex-col gap-2">
            {(Object.keys(SWING_LABELS) as SwingFeel[]).map((feel) => (
              <button
                key={feel}
                onClick={() => setSwing(feel)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  swing === feel
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-medium'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                }`}
              >
                {SWING_LABELS[feel]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
