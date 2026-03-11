export type Instrument = 'guitar' | 'saxophone' | 'piano' | 'other';

export interface IUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  instruments: Instrument[];
  practiceGoalMinutes: number; // daily goal
  createdAt: number;
  updatedAt: number;
}

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
  | 'repertoire';

export interface IPracticeSession {
  id?: string;
  deviceId: string;
  instrument: Instrument;
  durationMinutes: number;
  topics: PracticeTopic[];
  notes: string;
  bpm?: number;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: number; // unix ms
  audioMemoUrl?: string; // Firebase Storage download URL
}
