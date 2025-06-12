// mirror.js
import { MAJOR_NOTES, MINOR_NOTES } from './constants.js';
import { ENHARMONIC_MAP } from './piano.js';
import { renderUnifiedPiano } from './unifiedPiano.js';

let selectedPairs = [];

const CIRCLE_OF_FIFTHS_ORDER = [
  "C", "G", "D", "A", "E", "B", "F#/Gb", "Db", "Ab", "Eb", "Bb", "F"
];

const ENHARMONIC_KEY_MAP = {
  "F#": "F#/Gb", "Gb": "F#/Gb",
  "C#": "Db",    "Db": "Db",
  "D#": "Eb",    "Eb": "Eb", "D#/Ebm": "Eb", "D#/Eb": "Eb",
  "G#": "Ab",    "Ab": "Ab",
  "A#": "Bb",    "Bb": "Bb"
};

function normalizeForRotation(key) {
  const bare = key.replace(/m$/, "");
  return ENHARMONIC_KEY_MAP[bare] || bare;
}

const preferredSpellingsByKey = {
  "C": ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"],
  "G": ["C", "G", "D", "A", "E", "B", "F#", "E#", "Ab", "Eb", "Bb", "F"],
  "D": ["C", "G", "D", "A", "E", "B", "F#", "Db", "G#", "Eb", "Bb", "F"],
  "A": ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "Bb", "F"],
  "E": ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"],
  "B": ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"],
  "F#/Gb": ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"],
  "Db": ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"],
  "Ab": ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"],
  "Eb": ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"],
  "Bb": ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"],
  "F": ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"],
  "F#": ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "E#"],
  "C#": ["C", "Fx", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "E#"],
  "G#": ["C", "Fx", "Cx", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "E#"],
  "D#/Eb": ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"]
};

function getPreferredLabel(note, selectedKey) {
  const baseKey = selectedKey.replace(/m$/, "");
  const preferred = preferredSpellingsByKey[baseKey];
  if (!preferred) return note;
  const enhIndex = ENHARMONIC_MAP[note];
  return preferred.find(label => ENHARMONIC_MAP[label] === enhIndex) || note;
}
// Updated version of renderNegativeHarmonyCircle with working piano key click functionality
export function renderNegativeHarmonyCircle(selectedKey) {
  const containerId = "mirror-container";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.marginTop = "30px";
    document.body.appendChild(container);
  }
  container.innerHTML = "";

  // Create heading and SVG
  const heading = document.createElement("h3");
  heading.textContent = "Negative Harmony";
  heading.style.textAlign = "center";
  heading.style.marginBottom = "10px";
  container.appendChild(heading);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "-150 -150 300 300");
  svg.setAttribute("id", "mirrorSVG");
  svg.style.width = "300px";
  svg.style.height = "300px";

  const radiusOuter = 120;
  const radiusInner = 60;
  const wedgeAngle = (2 * Math.PI) / 12;

  const useMinor = selectedKey.endsWith("m");
  const baseKey = selectedKey.replace(/m$/, "");
  const normalizedKey = normalizeForRotation(baseKey);

  let spelling = preferredSpellingsByKey[selectedKey] || preferredSpellingsByKey[baseKey] || preferredSpellingsByKey[normalizedKey] || preferredSpellingsByKey[ENHARMONIC_KEY_MAP[normalizedKey]];
  if (!spelling) {
    console.warn(`No preferred spelling found for key: ${selectedKey}`);
    spelling = CIRCLE_OF_FIFTHS_ORDER;
  }

  const index = CIRCLE_OF_FIFTHS_ORDER.indexOf(normalizedKey);
  const rotationOffset = -((index + 4) * wedgeAngle);

  svg._rotationOffset = rotationOffset;
  svg._notes = spelling;
  svg._key = selectedKey;

  // Arrow marker
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3"
      orient="auto" markerUnits="strokeWidth">
      <path d="M 0 0 L 6 3 L 0 6 Z" fill="#333" />
    </marker>
  `;
  svg.appendChild(defs);

  // Draw wedges and labels
  spelling.forEach((note, i) => {
    const startAngle = i * wedgeAngle + rotationOffset;
    const endAngle = startAngle + wedgeAngle;
    const path = createWedgePath(startAngle, endAngle, radiusInner, radiusOuter);

    const wedge = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wedge.setAttribute("d", path);
    wedge.setAttribute("class", "mirror-wedge");
    wedge.setAttribute("data-index", i);
    wedge.addEventListener("click", () => toggleMirrorPair(i));
    svg.appendChild(wedge);

    const labelAngle = startAngle + wedgeAngle / 2;
    const rLabel = (radiusOuter + radiusInner) / 2;
    const x = rLabel * Math.cos(labelAngle);
    const y = rLabel * Math.sin(labelAngle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("class", "mirror-label");
    text.textContent = note;
    svg.appendChild(text);
  });

  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axis.setAttribute("x1", "0");
  axis.setAttribute("y1", "-130");
  axis.setAttribute("x2", "0");
  axis.setAttribute("y2", "130");
  axis.setAttribute("stroke", "black");
  axis.setAttribute("stroke-width", "2");
  svg.appendChild(axis);

  container.appendChild(svg);

  const pairsDisplay = document.createElement("div");
  pairsDisplay.id = "mirror-pairs";
  pairsDisplay.style.marginTop = "20px";
  pairsDisplay.style.textAlign = "center";
  container.appendChild(pairsDisplay);

  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear Arrows";
  clearButton.addEventListener("click", clearAllArrows);
  container.appendChild(clearButton);

  const keyboardZone = document.createElement("div");
  keyboardZone.id = "mirror-keyboards";
  keyboardZone.innerHTML = `
    <div id="mirror-piano-left"></div>
    <div class="arrow-label">→</div>
    <div id="mirror-piano-right"></div>
  `;
  container.appendChild(keyboardZone);

  setTimeout(() => updateMirrorPairsDisplay(), 0);
}



// Other functions (createWedgePath, toggleMirrorPair, etc.) remain unchanged


function createWedgePath(startAngle, endAngle, innerR, outerR) {
  const x1 = outerR * Math.cos(startAngle);
  const y1 = outerR * Math.sin(startAngle);
  const x2 = outerR * Math.cos(endAngle);
  const y2 = outerR * Math.sin(endAngle);
  const x3 = innerR * Math.cos(endAngle);
  const y3 = innerR * Math.sin(endAngle);
  const x4 = innerR * Math.cos(startAngle);
  const y4 = innerR * Math.sin(startAngle);
  const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;

  return `
    M ${x1} ${y1}
    A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2}
    L ${x3} ${y3}
    A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4}
    Z
  `;
}

function toggleMirrorPair(index) {
  const wedges = document.querySelectorAll(".mirror-wedge");
  const svg = document.getElementById("mirrorSVG");
  const notes = svg._notes;
  const wedgeAngle = (2 * Math.PI) / 12;
  const rotationOffset = svg._rotationOffset || 0;

  const angle = (index + 0.5) * wedgeAngle + rotationOffset;
  const mirrorAngle = Math.PI - angle;

  let closestDiff = Infinity;
  let mirrorIndex = -1;

  wedges.forEach(w => {
    const i = parseInt(w.getAttribute("data-index"));
    const wedgeCenter = (i + 0.5) * wedgeAngle + rotationOffset;
    let diff = Math.abs(Math.atan2(Math.sin(wedgeCenter - mirrorAngle), Math.cos(wedgeCenter - mirrorAngle)));
    if (diff < closestDiff) {
      closestDiff = diff;
      mirrorIndex = i;
    }
  });

  const wedge1 = wedges[index];
  const wedge2 = wedges[mirrorIndex];

  const forwardKey = `${notes[index]}-${notes[mirrorIndex]}`;
  const forwardExists = selectedPairs.includes(forwardKey);

  if (forwardExists) {
    selectedPairs = selectedPairs.filter(pair => pair !== forwardKey);
    const arrow = document.getElementById(`arrow-${forwardKey}`);
    if (arrow) {
      arrow.classList.add('fade-out');
      setTimeout(() => arrow.remove(), 300);
    }
  } else {
    selectedPairs.push(forwardKey);
    drawArrowBetweenWedges(index, mirrorIndex, forwardKey);
  }

  wedge1.classList.toggle("mirror-highlight", selectedPairs.some(pair => pair.includes(notes[index])));
  wedge2.classList.toggle("mirror-highlight", selectedPairs.some(pair => pair.includes(notes[mirrorIndex])));

  updateMirrorPairsDisplay();
}

function drawArrowBetweenWedges(i1, i2, idKey) {
  const svg = document.getElementById("mirrorSVG");
  const radius = 90;
  const wedgeAngle = (2 * Math.PI) / 12;
  const rotationOffset = svg._rotationOffset || 0;

  const angle1 = (i1 + 0.5) * wedgeAngle + rotationOffset;
  const angle2 = (i2 + 0.5) * wedgeAngle + rotationOffset;

  const x1 = radius * Math.cos(angle1);
  const y1 = radius * Math.sin(angle1);
  const x2 = radius * Math.cos(angle2);
  const y2 = radius * Math.sin(angle2);

  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
  arrow.setAttribute("id", `arrow-${idKey}`);
  arrow.setAttribute("x1", x1);
  arrow.setAttribute("y1", y1);
  arrow.setAttribute("x2", x2);
  arrow.setAttribute("y2", y2);
  arrow.setAttribute("stroke", "#333");
  arrow.setAttribute("stroke-width", "1.5");
  arrow.setAttribute("marker-end", "url(#arrowhead)");
  arrow.setAttribute("class", "mirror-arrow");
  svg.appendChild(arrow);
}

function updateMirrorPairsDisplay() {
  const svg = document.getElementById("mirrorSVG");
  const selectedKey = svg?._key || "C";

  const pairsDisplay = document.getElementById("mirror-pairs");
  if (!pairsDisplay) return;

  pairsDisplay.innerHTML = selectedPairs.map(pair => pair.replace('-', ' → ')).join('<br>');

  const fromNotes = [], toNotes = [];
  selectedPairs.forEach(pair => {
    const [from, to] = pair.split('-');
    fromNotes.push(...from.split('/'));
    toNotes.push(...to.split('/'));
  });

  const preferFlats = fromNotes.some(n => n.includes("b"));

  setTimeout(() => {
    renderUnifiedPiano({
      containerId: "mirror-piano-left",
      notes: fromNotes.map(n => ENHARMONIC_MAP[n]),
      compact: true,
      preferFlats,
      octaves: 1,
      scaleLabels: fromNotes.map(n => getPreferredLabel(n, selectedKey)),
      noteClickHandler: (noteIndex) => {
        console.log("[Mirror] Piano key clicked:", noteIndex);
        const semitone = noteIndex % 12;
        const possibleNotes = Object.entries(ENHARMONIC_MAP)
          .filter(([name, idx]) => idx === semitone)
          .map(([name]) => name);

        const match = possibleNotes.find(label => svg._notes.includes(label));

        if (match) {
          const wedgeIndex = svg._notes.findIndex(n => n === match);
          if (wedgeIndex !== -1) toggleMirrorPair(wedgeIndex);
        } else {
          console.warn("[Mirror] Note not found in spelling:", noteIndex, possibleNotes);
        }
      }
    });

    renderUnifiedPiano({
      containerId: "mirror-piano-right",
      notes: toNotes.map(n => ENHARMONIC_MAP[n]),
      compact: true,
      preferFlats,
      octaves: 1,
      scaleLabels: toNotes.map(n => getPreferredLabel(n, selectedKey))
    });
  }, 0);
}

export function clearAllArrows() {
  selectedPairs.forEach(pair => {
    const arrow = document.getElementById(`arrow-${pair}`);
    if (arrow) {
      arrow.classList.add("fade-out");
      setTimeout(() => arrow.remove(), 300);
    }
  });
  selectedPairs = [];
  document.querySelectorAll(".mirror-wedge").forEach(w => w.classList.remove("mirror-highlight"));
  updateMirrorPairsDisplay();
}

export function getMirroredKey(selectedKey) {
  const useMinor = selectedKey.endsWith("m");
  const keys = useMinor ? MINOR_NOTES : MAJOR_NOTES;
  const baseKey = useMinor ? selectedKey.replace("m", "") : selectedKey;

  let idx = keys.findIndex(k => k === selectedKey || k.includes(baseKey));
  if (idx === -1) return null;

  const mirroredIdx = (12 - idx) % 12;
  return keys[mirroredIdx];
}