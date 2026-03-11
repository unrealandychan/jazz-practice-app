import { describe, expect, it } from 'vitest';

import { getScaleNotes } from '@/data/scales';

describe('getScaleNotes', () => {
  it('returns correct notes for C major', () => {
    const notes = getScaleNotes('C', [0, 2, 4, 5, 7, 9, 11]);
    expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('returns correct notes for D Dorian', () => {
    const notes = getScaleNotes('D', [0, 2, 3, 5, 7, 9, 10]);
    expect(notes).toEqual(['D', 'E', 'F', 'G', 'A', 'B', 'C']);
  });

  it('returns empty array for unknown root', () => {
    const notes = getScaleNotes('Z', [0, 2, 4]);
    expect(notes).toEqual([]);
  });
});
