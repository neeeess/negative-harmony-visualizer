// piano.js

export const ENHARMONIC_MAP = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1, 'Bx': 1,
  'D': 2, 'Cx': 2,
  'D#': 3, 'Eb': 3, 'D#/Eb': 3,
  'E': 4, 'Fb': 4, 'Dx': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6, 'F#/Gb': 6,
  'G': 7, 'Fx': 7, 'F##': 7,
  'G#': 8, 'Ab': 8,
  'A': 9, 'Gx': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11, 'Ax': 11
};

// Each index is a semitone, e.g., 0 = C, 1 = C#, ..., 11 = B
export const INDEX_TO_LABEL = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// 3 octaves, each key has .notes and .isBlack
export const KEY_LAYOUT = Array.from({ length: 36 }, (_, i) => {
  const semitone = i % 12;
  const octave = Math.floor(i / 12);
  const isBlack = [1, 3, 6, 8, 10].includes(semitone);

  // Only label C, C#, D, etc. (no octave in label for display)
  const label = INDEX_TO_LABEL[i];

  const enharmonicEntries = Object.entries(ENHARMONIC_MAP)
    .filter(([, val]) => val === semitone)
    .map(([note]) => note); // don't append octave for display

  return {
    index: i,
    notes: enharmonicEntries,
    isBlack,
    label,
    semitone,
    octave
  };
});

export function getScaleIndices(rootIndex, mode = "major") {
  // These patterns are always relative to the root
  const majorPattern = [0, 2, 4, 5, 7, 9, 11];    // 7 degrees
  const minorPattern = [0, 2, 3, 5, 7, 8, 10];
  const pattern = mode === "minor" ? minorPattern : majorPattern;
  return pattern.map(offset => rootIndex + offset).filter(i => i >= 0 && i < 36);
}

export function usesFlats(key) {
  return [
    "F#/Gb", "Db", "Ab", "Eb", "Bb", "F",
    "Bbm", "Fm", "Cm", "Gm", "Dm", "D#/Ebm"
  ].includes(key);
}
