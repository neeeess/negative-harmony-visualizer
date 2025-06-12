export const MAJOR_NOTES = ["C", "G", "D", "A", "E", "B", "F#/Gb", "Db", "Ab", "Eb", "Bb", "F"];
export const MINOR_NOTES = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#/Ebm", "Bbm", "Fm", "Cm", "Gm", "Dm"];

export const MAJOR_CHORDS = {
  "C": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  "G": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  "D": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  "A": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  "E": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  "B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
  "F#/Gb": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
  "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"], // Sharp version
  "Gb": ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"], // Flat version
  "Db": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
  "Ab": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
  "Eb": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  "Bb": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  "F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"]
};

export const MINOR_CHORDS = {
  "Am": ["Am", "Bdim", "C", "Dm", "Em", "F", "G"],
  "Em": ["Em", "F#dim", "G", "Am", "Bm", "C", "D"],
  "Bm": ["Bm", "C#dim", "D", "Em", "F#m", "G", "A"],
  "F#m": ["F#m", "G#dim", "A", "Bm", "C#m", "D", "E"],
  "C#m": ["C#m", "D#dim", "E", "F#m", "G#m", "A", "B"],
  "G#m": ["G#m", "A#dim", "B", "C#m", "D#m", "E", "F#"],
  "D#/Ebm": ["D#m", "E#dim", "F#", "G#m", "A#m", "B", "C#"],
  "Ebm": ["Ebm", "Fdim", "Gb", "Abm", "Bbm", "Cb", "Db"], // Flat version
  "Bbm": ["Bbm", "Cdim", "Db", "Ebm", "Fm", "Gb", "Ab"],
  "Fm": ["Fm", "Gdim", "Ab", "Bbm", "Cm", "Db", "Eb"],
  "Cm": ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"],
  "Gm": ["Gm", "Adim", "Bb", "Cm", "Dm", "Eb", "F"],
  "Dm": ["Dm", "Edim", "F", "Gm", "Am", "Bb", "C"]
};

export const MAJOR_SCALES = {
  C: ["C", "D", "E", "F", "G", "A", "B"],
  G: ["G", "A", "B", "C", "D", "E", "F#"],
  D: ["D", "E", "F#", "G", "A", "B", "C#"],
  A: ["A", "B", "C#", "D", "E", "F#", "G#"],
  E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
  B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  "F#/Gb": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
  "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"], // Sharp version
  "Gb": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"], // Flat version
  "Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
  "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
  "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
  "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
  F: ["F", "G", "A", "Bb", "C", "D", "E"]
};

export const MINOR_SCALES = {
  Am: ["A", "B", "C", "D", "E", "F", "G"],
  Em: ["E", "F#", "G", "A", "B", "C", "D"],
  Bm: ["B", "C#", "D", "E", "F#", "G", "A"],
  "F#m": ["F#", "G#", "A", "B", "C#", "D", "E"],
  "C#m": ["C#", "D#", "E", "F#", "G#", "A", "B"],
  "G#m": ["G#", "A#", "B", "C#", "D#", "E", "F#"],
  "D#/Ebm": ["D#", "E#", "F#", "G#", "A#", "B", "C#"],
  "Ebm": ["Eb", "F", "Gb", "Ab", "Bb", "Cb", "Db"], // Flat version
  Bbm: ["Bb", "C", "Db", "Eb", "F", "Gb", "Ab"],
  Fm: ["F", "G", "Ab", "Bb", "C", "Db", "Eb"],
  Cm: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
  Gm: ["G", "A", "Bb", "C", "D", "Eb", "F"],
  Dm: ["D", "E", "F", "G", "A", "Bb", "C"]
};
