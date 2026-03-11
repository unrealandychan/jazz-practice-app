import { create } from 'zustand'

type TimerState = 'idle' | 'running' | 'paused'

interface SessionTimerStore {
  state: TimerState
  elapsedSeconds: number
  startTime: number | null
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
  tick: () => void
}

export const useSessionTimer = create<SessionTimerStore>((set, get) => ({
  state: 'idle',
  elapsedSeconds: 0,
  startTime: null,

  start: () =>
    set({ state: 'running', startTime: Date.now(), elapsedSeconds: 0 }),

  pause: () =>
    set((s) => ({
      state: 'paused',
      elapsedSeconds: s.elapsedSeconds + Math.floor((Date.now() - (s.startTime ?? Date.now())) / 1000),
      startTime: null,
    })),

  resume: () => set({ state: 'running', startTime: Date.now() }),

  stop: () => {
    const s = get()
    const extra = s.startTime ? Math.floor((Date.now() - s.startTime) / 1000) : 0
    set({ state: 'idle', elapsedSeconds: s.elapsedSeconds + extra, startTime: null })
  },

  reset: () => set({ state: 'idle', elapsedSeconds: 0, startTime: null }),

  tick: () => {
    const s = get()
    if (s.state === 'running' && s.startTime) {
      set({ elapsedSeconds: Math.floor((Date.now() - s.startTime) / 1000) })
    }
  },
}))
