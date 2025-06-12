// generateChordName.js

import { normalizeKeyForChart } from './normalizeKey.js';

const KEY_LETTERS = {
  "C":  ["C", "D", "E", "F", "G", "A", "B"],
  "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
  "G":  ["G", "A", "B", "C", "D", "E", "F#"],
  "G#": ["G#", "A#", "B#", "C#", "D#", "E#", "F##"],
  "D":  ["D", "E", "F#", "G", "A", "B", "C#"],
  "A":  ["A", "B", "C#", "D", "E", "F#", "G#"],
  "E":  ["E", "F#", "G#", "A", "B", "C#", "D#"],
  "B":  ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
  "Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
  "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
  "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
  "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
  "F":  ["F", "G", "A", "Bb", "C", "D", "E"]
};

const KEY_LETTERS_MINOR = {
  "A":  ["A", "B", "C", "D", "E", "F", "G"],
  "E":  ["E", "F#", "G", "A", "B", "C", "D"],
  "B":  ["B", "C#", "D", "E", "F#", "G", "A"],
  "F#": ["F#", "G#", "A", "B", "C#", "D", "E"],
  "C#": ["C#", "D#", "E", "F#", "G#", "A", "B"],
  "G#": ["G#", "A#", "B", "C#", "D#", "E", "F#"],
  "D#": ["D#", "E#", "F#", "G#", "A#", "B", "C#"],
  "A#": ["A#", "B#", "C#", "D#", "E#", "F#", "G#"],
  "D":  ["D", "E", "F", "G", "A", "Bb", "C"],
  "G":  ["G", "A", "Bb", "C", "D", "Eb", "F"],
  "C":  ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
  "F":  ["F", "G", "Ab", "Bb", "C", "Db", "Eb"],
  "Eb": ["Eb", "F", "Gb", "Ab", "Bb", "Cb", "Db"],
  "Bb": ["Bb", "C", "Db", "Eb", "F", "Gb", "Ab"],
  "Ab": ["Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb"]
};
const FLATS = {
  "C#": "Db", "D#": "Eb", "E#": "F", "F#": "Gb", "G#": "Ab", "A#": "Bb", "B#": "C"
};

const SEMITONES = {
  "C": 0,  "C#": 1,  "Db": 1,
  "D": 2,  "D#": 3,  "Eb": 3,
  "E": 4,  "Fb": 4,
  "F": 5,  "E#": 5,
  "F#": 6, "Gb": 6, "F##": 7,
  "G": 7,  "G#": 8,  "Ab": 8,
  "A": 9,  "A#": 10, "Bb": 10,
  "B": 11, "Cb": 11, "B#": 0
};

const ROMAN_TO_INDEX = {
  "I": 0, "II": 1, "III": 2, "IV": 3, "V": 4, "VI": 5, "VII": 6
};

function extractRomanParts(roman) {
  const match = roman.match(/^([b#]?)(VII|VI|IV|V|III|II|I)(.*)$/i);
  if (!match) return null;
  const [, accidental, numeral, suffix] = match;
  return { accidental, numeral, suffix: suffix || "" };
}

function getLetterFromDegree(scale, degree) {
  return scale && scale[degree] ? scale[degree][0] : null;
}

export function generateChordName(roman, key = "C") {
  const parts = extractRomanParts(roman);
  if (!parts) return "?";

  const { normalizedKey, isMinor } = normalizeKeyForChart(key);
  const scale = isMinor ? KEY_LETTERS_MINOR[normalizedKey] : KEY_LETTERS[normalizedKey];
  if (!scale) return "?";

  const { accidental, numeral, suffix: rawSuffix } = parts;
  const isRomanMinor = /^[b#]?[iv]+/.test(roman);
  const degree = ROMAN_TO_INDEX[numeral.toUpperCase()];
  if (degree === undefined) return "?";

  const base = scale[degree];
  let semitone = SEMITONES[base];
  if (accidental === "b") semitone = (semitone + 11) % 12;
  else if (accidental === "#") semitone = (semitone + 1) % 12;

  const expectedLetter = getLetterFromDegree(scale, degree);
  let finalNote = Object.keys(SEMITONES).find(n =>
    SEMITONES[n] === semitone && n[0] === expectedLetter
  ) || Object.keys(SEMITONES).find(n => SEMITONES[n] === semitone);

  let suffix = rawSuffix
    .replace("maj7", "maj7")
    .replace("°", "dim")
    .replace("ø", "ø")
    .replace("b6", "b6");

  if (isRomanMinor && !/dim|ø/.test(suffix) && !/m/.test(suffix)) {
    finalNote += "m";
  }

  return finalNote + suffix;
}

// --- Mirror Table Integration ---

import { BASE_MIRROR_TABLE, BASE_MIRROR_TABLE2 } from './mirrorData.js';

export function getMirrorTableForKey(inputKey = "C") {
  let mode = "major";
  let keyRoot = inputKey;

  if (inputKey.endsWith("m")) {
    mode = "minor";
    keyRoot = inputKey.slice(0, -1);
  }

  const { normalizedKey } = normalizeKeyForChart(inputKey);

  if (!(normalizedKey in KEY_LETTERS) && !(normalizedKey in KEY_LETTERS_MINOR)) {
    keyRoot = normalizedKey.split("/")[0];
    if (!(keyRoot in KEY_LETTERS) && !(keyRoot in KEY_LETTERS_MINOR)) return [];
  }

  const table = mode === "minor" ? BASE_MIRROR_TABLE2 : BASE_MIRROR_TABLE;

  return table.map(([rootGroup, roman, mirrorRoman]) => {
    const chord = generateChordName(roman, inputKey);
    const mirrorChord = generateChordName(mirrorRoman, inputKey);
    return { rootGroup, roman, chord, mirrorRoman, mirrorChord };
  });
}
