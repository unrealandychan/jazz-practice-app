import { create } from 'zustand'

export type SwingFeel = 'straight' | 'light' | 'heavy'

interface MetronomeStore {
  bpm: number
  isPlaying: boolean
  timeSignature: number
  currentBeat: number
  swing: SwingFeel
  setBpm: (bpm: number) => void
  setTimeSignature: (ts: number) => void
  setSwing: (swing: SwingFeel) => void
  setPlaying: (playing: boolean) => void
  setCurrentBeat: (beat: number) => void
}

export const useMetronome = create<MetronomeStore>((set) => ({
  bpm: 120,
  isPlaying: false,
  timeSignature: 4,
  currentBeat: 0,
  swing: 'straight',

  setBpm: (bpm) => set({ bpm: Math.min(300, Math.max(20, bpm)) }),
  setTimeSignature: (timeSignature) => set({ timeSignature }),
  setSwing: (swing) => set({ swing }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentBeat: (currentBeat) => set({ currentBeat }),
}))
