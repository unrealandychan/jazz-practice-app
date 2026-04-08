'use client';

import { Mic, MicOff } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

// Autocorrelation-based pitch detection
function detectPitch(buf: Float32Array<ArrayBuffer>, sampleRate: number): number | null {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  if (Math.sqrt(rms / SIZE) < 0.015) return null;

  // Only check lags in the musically useful range (50 Hz – 1600 Hz)
  const MAX_LAG = Math.ceil(sampleRate / 50);
  const MIN_LAG = Math.floor(sampleRate / 1600);
  if (SIZE <= MAX_LAG) return null;

  // Normalized autocorrelation
  const corr = new Float32Array(MAX_LAG);
  for (let lag = 0; lag < MAX_LAG; lag++) {
    let sum = 0;
    const limit = SIZE - lag;
    for (let j = 0; j < limit; j++) sum += buf[j] * buf[j + lag];
    corr[lag] = sum;
  }
  if (corr[0] === 0) return null;
  const scale = 1 / corr[0];
  for (let i = 0; i < MAX_LAG; i++) corr[i] *= scale;

  // Find the first dip following the initial peak
  let d = MIN_LAG;
  while (d < MAX_LAG - 1 && corr[d] > corr[d + 1]) d++;

  // Find the tallest peak after the dip (the fundamental period)
  let maxCorr = -1;
  let maxLag = -1;
  for (let i = d; i < MAX_LAG; i++) {
    if (corr[i] > maxCorr) {
      maxCorr = corr[i];
      maxLag = i;
    }
  }

  if (maxCorr < 0.5 || maxLag < 1 || maxLag >= MAX_LAG - 1) return null;

  // Parabolic interpolation for sub-sample accuracy
  const y1 = corr[maxLag - 1];
  const y2 = corr[maxLag];
  const y3 = corr[maxLag + 1];
  const a = (y1 + y3 - 2 * y2) / 2;
  const T0 = a !== 0 ? maxLag - (y3 - y1) / (4 * a) : maxLag;

  return sampleRate / T0;
}

function freqToNoteInfo(freq: number): { noteName: string; octave: number; cents: number } {
  // A4 = 440 Hz = MIDI 69
  const midi = 12 * Math.log2(freq / 440) + 69;
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);
  const noteName = NOTE_NAMES[((roundedMidi % 12) + 12) % 12];
  const octave = Math.floor(roundedMidi / 12) - 1;
  return { noteName, octave, cents };
}

// Gauge geometry constants
const R = 80; // arc radius (in SVG units, relative to translated origin)
const INNER_R = 68; // tick inner radius

// Background arc spans ±60° from vertical
const ARC_ANGLE = (60 * Math.PI) / 180;
const ARC_X = +(R * Math.sin(ARC_ANGLE)).toFixed(2); // 69.28
const ARC_Y = +(-R * Math.cos(ARC_ANGLE)).toFixed(2); // -40.00

// In-tune zone spans ±6° from vertical (≈ ±5 cents mapped)
const TUNE_ANGLE = (6 * Math.PI) / 180;
const TUNE_X = +(R * Math.sin(TUNE_ANGLE)).toFixed(2); // 8.37
const TUNE_Y = +(-R * Math.cos(TUNE_ANGLE)).toFixed(2); // -79.56

// Tick marks at -50, -25, 0, +25, +50 cents positions
const TICK_DEGS = [-60, -30, 0, 30, 60];
const ticks = TICK_DEGS.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return {
    deg,
    ox: +(R * Math.sin(rad)).toFixed(2),
    oy: +(-R * Math.cos(rad)).toFixed(2),
    ix: +(INNER_R * Math.sin(rad)).toFixed(2),
    iy: +(-INNER_R * Math.cos(rad)).toFixed(2),
  };
});

export default function TunerPage(): React.JSX.Element {
  const [isListening, setIsListening] = useState(false);
  const [noteName, setNoteName] = useState('--');
  const [octave, setOctave] = useState<number | null>(null);
  const [cents, setCents] = useState(0);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [hasSignal, setHasSignal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const bufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Use a ref to avoid stale closures in the RAF loop
  const hasSignalRef = useRef(false);

  const stopListening = useCallback((): void => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (silenceTimerRef.current !== null) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    bufRef.current = null;
    hasSignalRef.current = false;
    setIsListening(false);
    setNoteName('--');
    setOctave(null);
    setCents(0);
    setFrequency(null);
    setHasSignal(false);
  }, []);

  const startListening = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0;
      analyserRef.current = analyser;
      bufRef.current = new Float32Array(analyser.fftSize);
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);
    } catch {
      setError('Microphone access denied. Please allow microphone permissions and try again.');
    }
  }, []);

  // Animation loop — runs only while listening
  useEffect(() => {
    if (!isListening || !analyserRef.current || !bufRef.current) return;

    const analyse = (): void => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      analyserRef.current!.getFloatTimeDomainData(bufRef.current!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const freq = detectPitch(bufRef.current!, audioCtxRef.current!.sampleRate);

      if (freq !== null) {
        if (silenceTimerRef.current !== null) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        const info = freqToNoteInfo(freq);
        hasSignalRef.current = true;
        setNoteName(info.noteName);
        setOctave(info.octave);
        setCents(info.cents);
        setFrequency(freq);
        setHasSignal(true);
      } else if (hasSignalRef.current && silenceTimerRef.current === null) {
        // Clear display after 800 ms of silence
        silenceTimerRef.current = setTimeout(() => {
          hasSignalRef.current = false;
          setNoteName('--');
          setOctave(null);
          setCents(0);
          setFrequency(null);
          setHasSignal(false);
          silenceTimerRef.current = null;
        }, 800);
      }

      rafRef.current = requestAnimationFrame(analyse);
    };

    rafRef.current = requestAnimationFrame(analyse);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isListening]);

  // Clean up on unmount
  useEffect(() => () => stopListening(), [stopListening]);

  // Map cents to needle rotation: ±50 cents → ±60°
  const needleAngle = (Math.max(-50, Math.min(50, cents)) / 50) * 60;
  const isInTune = hasSignal && Math.abs(cents) <= 5;
  const needleColor = isInTune
    ? '#22c55e'
    : hasSignal
      ? 'var(--accent)'
      : 'var(--muted-foreground)';

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Chromatic Tuner</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Tune your instrument in real time.</p>
      </div>

      {error && (
        <div
          className="mb-6 p-4 rounded-lg border text-sm"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
            borderColor: 'color-mix(in srgb, var(--destructive) 30%, transparent)',
            color: 'var(--destructive)',
          }}
        >
          {error}
        </div>
      )}

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6">
        {/* Gauge */}
        <div className="w-full max-w-xs">
          <svg viewBox="0 0 200 120" className="w-full" aria-label="Tuner gauge">
            <g transform="translate(100, 110)">
              {/* Background track arc (-60° to +60° from vertical) */}
              <path
                d={`M ${-ARC_X} ${ARC_Y} A ${R} ${R} 0 0 1 ${ARC_X} ${ARC_Y}`}
                fill="none"
                stroke="var(--border)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* In-tune zone highlight */}
              <path
                d={`M ${-TUNE_X} ${TUNE_Y} A ${R} ${R} 0 0 1 ${TUNE_X} ${TUNE_Y}`}
                fill="none"
                stroke={isInTune ? '#22c55e' : 'var(--muted-foreground)'}
                strokeWidth="6"
                strokeLinecap="round"
                opacity={isInTune ? 0.7 : 0.2}
              />

              {/* Tick marks */}
              {ticks.map(({ deg, ox, oy, ix, iy }) => (
                <line
                  key={deg}
                  x1={ox}
                  y1={oy}
                  x2={ix}
                  y2={iy}
                  stroke={deg === 0 ? 'var(--foreground)' : 'var(--muted-foreground)'}
                  strokeWidth={deg === 0 ? 2 : 1.5}
                  opacity={deg === 0 ? 0.7 : 0.5}
                />
              ))}

              {/* 0-cent label */}
              <text
                x="0"
                y="-55"
                fill="var(--muted-foreground)"
                fontSize="7"
                textAnchor="middle"
                opacity="0.6"
              >
                0
              </text>

              {/* Needle */}
              <g
                style={{
                  transform: `rotate(${needleAngle}deg)`,
                  transformOrigin: '0px 0px',
                  transition: isListening ? 'transform 0.08s linear' : 'none',
                }}
              >
                <line
                  x1="0"
                  y1="8"
                  x2="0"
                  y2="-68"
                  stroke={needleColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={isListening ? 1 : 0.3}
                />
                <circle cx="0" cy="0" r="5" fill={needleColor} opacity={isListening ? 1 : 0.3} />
              </g>
            </g>

            {/* Flat / sharp labels */}
            <text
              x="14"
              y="116"
              fill="var(--muted-foreground)"
              fontSize="12"
              textAnchor="middle"
              opacity="0.7"
            >
              ♭
            </text>
            <text
              x="186"
              y="116"
              fill="var(--muted-foreground)"
              fontSize="12"
              textAnchor="middle"
              opacity="0.7"
            >
              ♯
            </text>
          </svg>
        </div>

        {/* Note name */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-end gap-1">
            <span
              className="text-7xl font-bold leading-none transition-colors duration-150"
              style={{ color: isInTune ? '#22c55e' : 'var(--foreground)' }}
            >
              {noteName}
            </span>
            {octave !== null && (
              <span className="text-2xl font-medium text-[var(--muted-foreground)] mb-2">
                {octave}
              </span>
            )}
          </div>
          {frequency !== null && (
            <span className="text-sm text-[var(--muted-foreground)]">
              {frequency.toFixed(1)} Hz
            </span>
          )}
        </div>

        {/* Cents readout */}
        <div className="flex items-center gap-2 h-9">
          <span
            className="text-3xl font-semibold tabular-nums w-20 text-right transition-colors duration-150"
            style={{ color: isInTune ? '#22c55e' : 'var(--accent)' }}
          >
            {hasSignal ? (cents >= 0 ? `+${cents}` : `${cents}`) : '±0'}
          </span>
          <span className="text-[var(--muted-foreground)] text-sm">cents</span>
          {isInTune && <span className="text-green-500 text-sm font-medium">In Tune ✓</span>}
        </div>

        {/* Start / Stop button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
          style={
            isListening
              ? {
                  backgroundColor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
                  color: 'var(--destructive)',
                  border: '1px solid color-mix(in srgb, var(--destructive) 30%, transparent)',
                }
              : {
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-foreground)',
                }
          }
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Stop Tuner
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Tuner
            </>
          )}
        </button>
      </div>

      {/* Reference info */}
      <p className="mt-4 text-xs text-[var(--muted-foreground)] text-center">
        Reference: A4 = 440 Hz · Chromatic · 12-TET tuning
      </p>
    </div>
  );
}
