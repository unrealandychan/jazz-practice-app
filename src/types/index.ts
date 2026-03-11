export type Instrument = 'guitar' | 'saxophone' | 'piano' | 'other'

export type PracticeTopic =
  | 'scales'
  | 'ii-V-I'
  | 'standards'
  | 'improvisation'
  | 'technique'
  | 'rhythm'
  | 'ear-training'
  | 'chords'
  | 'sight-reading'
  | 'repertoire'

export interface PracticeSession {
  id?: string
  deviceId: string
  instrument: Instrument
  durationMinutes: number
  topics: PracticeTopic[]
  notes: string
  bpm?: number
  date: string // ISO date string YYYY-MM-DD
  createdAt: number // unix ms
}
