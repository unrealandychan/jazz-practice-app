export type ScaleType =
  | 'major'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian'
  | 'bebop-dominant'
  | 'bebop-major'
  | 'altered'
  | 'whole-tone'
  | 'diminished'
  | 'half-whole'
  | 'pentatonic-major'
  | 'pentatonic-minor'
  | 'blues';

export interface IScale {
  name: string;
  type: ScaleType;
  intervals: number[]; // semitones from root
  degrees: string[];
  description: string;
  jazzContext: string;
}

export const SCALES: IScale[] = [
  {
    name: 'Major (Ionian)',
    type: 'major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    degrees: ['1', '2', '3', '4', '5', '6', '7'],
    description: 'The standard major scale.',
    jazzContext: 'Use over Δ7 (major seventh) chords.',
  },
  {
    name: 'Dorian',
    type: 'dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    degrees: ['1', '2', '♭3', '4', '5', '6', '♭7'],
    description: 'Minor scale with a natural 6th.',
    jazzContext: 'The signature scale for ii-7 chords in jazz. Think "So What" by Miles Davis.',
  },
  {
    name: 'Mixolydian',
    type: 'mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    degrees: ['1', '2', '3', '4', '5', '6', '♭7'],
    description: 'Major scale with a flatted 7th.',
    jazzContext: 'Use over dominant 7th (V7) chords without alterations.',
  },
  {
    name: 'Altered (Super Locrian)',
    type: 'altered',
    intervals: [0, 1, 3, 4, 6, 8, 10],
    degrees: ['1', '♭9', '♯9', '3', '♭5', '♯5', '♭7'],
    description: 'All tensions altered. Maximum tension over dominant.',
    jazzContext: 'Use over V7alt chords resolving to a minor or major tonic.',
  },
  {
    name: 'Bebop Dominant',
    type: 'bebop-dominant',
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    degrees: ['1', '2', '3', '4', '5', '6', '♭7', '7'],
    description: '8-note scale — adds natural 7 to Mixolydian.',
    jazzContext: 'Essential bebop vocabulary. Chord tones land on downbeats.',
  },
  {
    name: 'Bebop Major',
    type: 'bebop-major',
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    degrees: ['1', '2', '3', '4', '5', '♭6', '6', '7'],
    description: '8-note scale — adds ♭6 to the major scale.',
    jazzContext: 'Use over major seventh chords. Classic bebop sound.',
  },
  {
    name: 'Whole Tone',
    type: 'whole-tone',
    intervals: [0, 2, 4, 6, 8, 10],
    degrees: ['1', '2', '3', '♯4', '♯5', '♭7'],
    description: 'Symmetrical — only whole steps.',
    jazzContext: 'Use over V7♯5 or V7♯11 chords. Dreamy, unresolved sound.',
  },
  {
    name: 'Diminished (Whole-Half)',
    type: 'diminished',
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    degrees: ['1', '2', '♭3', '4', '♭5', '♭6', '6', '7'],
    description: 'Symmetrical 8-note scale, whole-half pattern.',
    jazzContext: 'Use over dim7 chords and half-diminished chords.',
  },
  {
    name: 'Half-Whole Diminished',
    type: 'half-whole',
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    degrees: ['1', '♭9', '♯9', '3', '♯11', '5', '13', '♭7'],
    description: 'Symmetrical 8-note scale, half-whole pattern.',
    jazzContext: 'Use over dominant 7th chords. Contains ♭9, ♯9, ♯11, and 13.',
  },
  {
    name: 'Major Pentatonic',
    type: 'pentatonic-major',
    intervals: [0, 2, 4, 7, 9],
    degrees: ['1', '2', '3', '5', '6'],
    description: '5-note major subset.',
    jazzContext: 'Play a major pentatonic a whole step above V7 for instant "outside" sound.',
  },
  {
    name: 'Minor Pentatonic',
    type: 'pentatonic-minor',
    intervals: [0, 3, 5, 7, 10],
    degrees: ['1', '♭3', '4', '5', '♭7'],
    description: '5-note minor subset.',
    jazzContext:
      'Foundation of blues and soul. Stack pentatonics from different roots over jazz changes.',
  },
  {
    name: 'Blues Scale',
    type: 'blues',
    intervals: [0, 3, 5, 6, 7, 10],
    degrees: ['1', '♭3', '4', '♭5', '5', '♭7'],
    description: 'Minor pentatonic + ♭5 "blue note".',
    jazzContext: 'Use freely over blues progressions and dominant 7th chords.',
  },
];

export const ROOTS = [
  'C',
  'C♯/D♭',
  'D',
  'D♯/E♭',
  'E',
  'F',
  'F♯/G♭',
  'G',
  'G♯/A♭',
  'A',
  'A♯/B♭',
  'B',
];

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getScaleNotes(root: string, intervals: number[]): string[] {
  const rootIndex = NOTE_NAMES.indexOf(root.replace('♯', '#').replace('♭', 'b').split('/')[0]);
  if (rootIndex === -1) return [];
  return intervals.map((interval) => NOTE_NAMES[(rootIndex + interval) % 12]);
}
