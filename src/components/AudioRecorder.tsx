'use client';

import { Mic, MicOff, Pause, Play, Square, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped';

interface IAudioRecorderProps {
  /** Called whenever the recorded blob changes (null = cleared). */
  onBlobReady: (blob: Blob | null) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function AudioRecorder({ onBlobReady }: IAudioRecorderProps) {
  const [recState, setRecState] = useState<RecorderState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [blobSize, setBlobSize] = useState(0);
  const [supported, setSupported] = useState(true);
  const [permDenied, setPermDenied] = useState(false);

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setSupported(false);
    }
  }, []);

  function startTimer() {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function handleStart() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      // Pick the best supported format
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'].find((m) =>
        MediaRecorder.isTypeSupported(m),
      );

      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, {
          type: mimeType ?? 'audio/webm',
        });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setBlobSize(blob.size);
        onBlobReady(blob);
      };

      mr.start(250); // collect chunks every 250 ms
      setRecState('recording');
      setElapsed(0);
      startTimer();
    } catch {
      setPermDenied(true);
    }
  }

  function handlePause() {
    mediaRecRef.current?.pause();
    stopTimer();
    setRecState('paused');
  }

  function handleResume() {
    mediaRecRef.current?.resume();
    startTimer();
    setRecState('recording');
  }

  function handleStop() {
    stopTimer();
    mediaRecRef.current?.stop();
    setRecState('stopped');
  }

  function handleDiscard() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setBlobSize(0);
    setElapsed(0);
    setRecState('idle');
    onBlobReady(null);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!supported) {
    return (
      <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
        <MicOff className="w-3.5 h-3.5" /> Audio recording is not supported in this browser.
      </p>
    );
  }

  if (permDenied) {
    return (
      <p className="text-xs text-[var(--destructive)] flex items-center gap-1.5">
        <MicOff className="w-3.5 h-3.5" /> Microphone access was denied. Enable it in browser
        settings to record.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {recState === 'recording' && (
            <span className="w-2 h-2 rounded-full bg-[var(--destructive)] animate-pulse" />
          )}
          <span className="text-xs font-mono text-[var(--foreground)] tabular-nums">
            {formatTime(elapsed)}
          </span>
          {recState === 'recording' && (
            <span className="text-xs text-[var(--destructive)]">Recording</span>
          )}
          {recState === 'paused' && (
            <span className="text-xs text-[var(--muted-foreground)]">Paused</span>
          )}
          {recState === 'stopped' && blobSize > 0 && (
            <span className="text-xs text-[var(--muted-foreground)]">
              {(blobSize / 1024).toFixed(0)} KB · ready to save
            </span>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-2">
          {recState === 'idle' && (
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--destructive)]/10 text-[var(--destructive)] text-xs font-medium hover:bg-[var(--destructive)]/20 transition-colors"
            >
              <Mic className="w-3.5 h-3.5" /> Record memo
            </button>
          )}

          {recState === 'recording' && (
            <>
              <button
                type="button"
                onClick={handlePause}
                className="p-1.5 rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                title="Pause"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="p-1.5 rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                title="Stop"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {recState === 'paused' && (
            <>
              <button
                type="button"
                onClick={handleResume}
                className="p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                title="Resume"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="p-1.5 rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                title="Stop"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {recState === 'stopped' && (
            <button
              type="button"
              onClick={handleDiscard}
              className="p-1.5 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
              title="Discard recording"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Playback */}
      {blobUrl && recState === 'stopped' && (
        <audio
          ref={audioRef}
          src={blobUrl}
          controls
          className="w-full h-8"
          style={{ colorScheme: 'dark' }}
        />
      )}
    </div>
  );
}
