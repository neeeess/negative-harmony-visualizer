import { renderUnifiedPiano } from './unifiedPiano.js';
import { usesFlats, getScaleIndices, ENHARMONIC_MAP } from './piano.js';
import { MAJOR_CHORDS, MINOR_CHORDS } from './constants.js';
import { SCALE_SPELLINGS } from './scaleSpellings.js';
import { showRomanNumerals } from './roman.js';
import { renderNegativeHarmonyCircle, clearAllArrows } from './mirror.js';
import { initializeTopChordPopups } from './main.js';

export function displayChords(key, isMinor) {
  let chords = isMinor ? MINOR_CHORDS[key] : MAJOR_CHORDS[key];
  let extraChords = null;

  // Handle enharmonic extra chords for special cases
  if (key === "D#/Ebm") {
    chords = MINOR_CHORDS["D#/Ebm"];
    extraChords = MINOR_CHORDS["Ebm"];
  } else if (key === "F#/Gb") {
    chords = MAJOR_CHORDS["F#/Gb"];
    extraChords = MAJOR_CHORDS["Gb"];
  }

  const numerals = isMinor
    ? ["i", "ii°", "III", "iv", "v", "VI", "VII"]
    : ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  const functions = isMinor
    ? ["tonic", "supertonic", "mediant", "subdominant", "dominant", "submediant", "subtonic"]
    : ["tonic", "supertonic", "mediant", "subdominant", "dominant", "submediant", "leading tone"];

  const keyLabelMap = {
    "D#/Ebm": "D#/Eb",
    "F#/Gb": "F#/Gb"
  };
  const keyLabel = keyLabelMap[key] || key;

  const keyName = `${keyLabel.replace(/m$/, "")} ${isMinor ? "minor" : "major"}`;
  const subText = `Chords in ${keyName}`;

  document.getElementById("keyInfo").style.display = "block";
  document.getElementById("keyHeadline").textContent = keyName;
  document.getElementById("keySubhead").textContent = subText;

  const chordsDisplay = document.getElementById("chordsDisplay");
  chordsDisplay.innerHTML = "";

  // Table for chords and functions
const table = document.createElement("table");
table.classList.add("chord-table", "top-chord-table");

  const row1 = document.createElement("tr");
  numerals.forEach(n => {
    const th = document.createElement("th");
    th.textContent = n;
    row1.appendChild(th);
  });

  const row2 = document.createElement("tr");
  functions.forEach(fn => {
    const td = document.createElement("td");
    td.textContent = fn;
    row2.appendChild(td);
  });

  const row3 = document.createElement("tr");
  chords.forEach(chord => {
    const td = document.createElement("td");
    td.textContent = chord;
    td.classList.add("top-chord-cell");
    td.dataset.chord = chord;
    row3.appendChild(td);
  });

  table.appendChild(row1);
  table.appendChild(row2);
  table.appendChild(row3);

  if (extraChords) {
    const row4 = document.createElement("tr");
    extraChords.forEach(chord => {
      const td = document.createElement("td");
      td.textContent = chord;
      td.style.opacity = 0.8;
      td.classList.add("top-chord-cell");
      td.dataset.chord = chord;
      row4.appendChild(td);
    });
    table.appendChild(row4);
  }

  chordsDisplay.appendChild(table);

  // Piano setup
  const pianoContainer = document.createElement("div");
  pianoContainer.id = "piano-container";
  pianoContainer.style.marginTop = "30px";

  const pianoDiv = document.createElement("div");
  pianoDiv.className = "piano";
  pianoDiv.id = "main-piano";
  pianoDiv.classList.add("main-piano");
  pianoContainer.appendChild(pianoDiv);

  chordsDisplay.appendChild(pianoContainer);

  showRomanNumerals(key, isMinor);
  clearAllArrows();
  renderNegativeHarmonyCircle(key);

  // --------- SCALE SPELLINGS & HIGHLIGHTED KEYS ----------
  // 1. Figure out root note index (C, D, Eb, etc.)
  const rootName = key.replace(/m$/, '').replace(/\/.*$/, '');
  const rootIndex = ENHARMONIC_MAP[rootName];

  // 2. Indices for main scale in this key
  const octaves = 2;
  let indices = getScaleIndices(rootIndex, isMinor ? 'minor' : 'major');

  // 3. Add root one octave up (if within range)
  const rootOctaveUp = rootIndex + 12 * (octaves - 1);
  if (rootOctaveUp < octaves * 12) {
    indices.push(rootOctaveUp);
  }

  // 4. Get scale labels for this key (only for highlighted notes)
  let scaleLabels = SCALE_SPELLINGS[key];
  if (!scaleLabels) scaleLabels = SCALE_SPELLINGS[rootName];
  // Handle double array for enharmonic keys
  if (Array.isArray(scaleLabels) && Array.isArray(scaleLabels[0])) {
    scaleLabels = scaleLabels[0].map((v, idx) => [v, scaleLabels[1][idx]]);
  }

  // Only send labels for highlighted notes (to match indices order)
  // This is important if your renderUnifiedPiano expects scaleLabels.length === indices.length
  // If your renderUnifiedPiano expects the **full array**, then adjust this part!
  // But if not, this should be fine:
  // renderUnifiedPiano expects:
  //   notes: [indices of keys to highlight]
  //   scaleLabels: [label or array of labels for each highlighted key, in order]

  renderUnifiedPiano({
    containerId: "main-piano",
    notes: indices,
    compact: false,
    scaleLabels,
    octaves,
    chordName: key
  });

  requestAnimationFrame(() => {
    initializeTopChordPopups();
  });
}
