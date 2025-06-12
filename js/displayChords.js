// displayChords.js

const SEMITONES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Enhance with flat-to-sharp map
const ENHARMONIC_EQUIV = {
  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'F##': 'G', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
  'E#': 'F', 'B#': 'C'
};

function normalizeNote(note) {
  // First, handle double sharps/flats explicitly
  if (note.endsWith('##')) {
    const base = note[0];
    const sharpIndex = (SEMITONES.indexOf(base) + 2) % 12;
    return SEMITONES[sharpIndex];
  }
  if (note.endsWith('bb')) {
    const base = note[0];
    const flatIndex = (SEMITONES.indexOf(base) + 10) % 12; // -2 mod 12
    return SEMITONES[flatIndex];
  }
  return ENHARMONIC_EQUIV[note] || note;
}


function noteIndex(note) {
  return SEMITONES.indexOf(normalizeNote(note));
}

function transpose(rootIndex, intervals) {
  return intervals.map(i => SEMITONES[(rootIndex + i) % 12]);
}

export function getChordNotes(chordName) {
  const match = chordName.match(/^([A-G](?:b{1,2}|#{1,2})?)(.*)$/);
  if (!match) return [];

  const [, rootRaw, suffix] = match;
  const root = normalizeNote(rootRaw);
  const rootIndex = noteIndex(root);
  if (rootIndex === -1) return [];

  const suffixLower = suffix.toLowerCase();

  if (suffix === '' || suffix === 'maj') {
    return transpose(rootIndex, [0, 4, 7]); // Major
  } else if (suffixLower === 'm') {
    return transpose(rootIndex, [0, 3, 7]); // Minor
  } else if (suffixLower === '6') {
    return transpose(rootIndex, [0, 4, 7, 9]); // 6th
  } else if (suffixLower === 'm6') {
    return transpose(rootIndex, [0, 3, 7, 9]); // Minor 6th
  } else if (suffixLower === 'mb6') {
    return transpose(rootIndex, [0, 3, 7, 8]); // Minor b6th
  } else if (suffixLower === 'dim') {
    return transpose(rootIndex, [0, 3, 6]); // Diminished triad
  } else if (suffixLower === 'dim7') {
    return transpose(rootIndex, [0, 3, 6, 9]); // Diminished 7th
  } else if (suffixLower === 'maj7') {
    return transpose(rootIndex, [0, 4, 7, 11]); // Major 7th
  } else if (suffixLower === '7') {
    return transpose(rootIndex, [0, 4, 7, 10]); // Dominant 7th
  } else if (suffixLower === 'm7') {
    return transpose(rootIndex, [0, 3, 7, 10]); // Minor 7th
  } else if (suffixLower === 'ø7' || suffixLower === 'o7') {
    return transpose(rootIndex, [0, 3, 6, 10]); // Half-diminished 7th
  } else if (suffixLower === '+') {
    return transpose(rootIndex, [0, 4, 8]); // Augmented triad
  }

  return []; // Unknown chord
}
