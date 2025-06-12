import { displayNegativeHarmonyChordChart } from './negativeChart.js';
import { renderCircleOfFifths } from './render.js';
import { renderNegativeHarmonyCircle } from './mirror.js';
import { getChordNotes } from './displayChords.js';
import { renderUnifiedPiano } from './unifiedPiano.js';

const tippy = window.tippy;

// Map notes (C, D#, etc) to semitone indices for the piano renderer
const NOTE_TO_INDEX = {
  'C': 0,  'C#': 1,  'Db': 1,
  'D': 2,  'D#': 3,  'Eb': 3,
  'E': 4,  'Fb': 4,  'E#': 5,
  'F': 5,  'F#': 6,  'Gb': 6,
  'G': 7,  'F##': 7, 'G#': 8,  'Ab': 8,
  'A': 9,  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11, 'B#': 0
};

function chordNotesToIndices(notes) {
  // Return an array of numbers representing keys on the piano
  return notes.map(n => NOTE_TO_INDEX[n]);
}

const keyToClefImage = {
  "C": "cmaj.png", "Am": "cmaj.png",
  "G": "gmaj.png", "Em": "gmaj.png",
  "D": "dmaj.png", "Bm": "dmaj.png",
  "A": "amaj.png", "F#m": "amaj.png",
  "E": "emaj.png", "C#m": "csharpmaj.png",
  "B": "bmaj.png", "G#m": "bmaj.png",
  "F#": "gflatmaj.png", "D#/Ebm": "gflatmaj.png",
  "F#/Gb": "gflatmaj.png", "Db": "dflatmaj.png",
  "Bbm": "dflatmaj.png", "Ab": "aflatmaj.png",
  "Fm": "aflatmaj.png", "Eb": "eflatmaj.png",
  "Cm": "eflatmaj.png", "Bb": "bflatmaj.png",
  "Gm": "bflatmaj.png", "F": "fmaj.png",
  "Dm": "fmaj.png"
};

function updateClefImage(selectedKey) {
  const container = document.getElementById('clef-container');
  container.innerHTML = "";

  const imageFile = keyToClefImage[selectedKey];
  if (container && imageFile) {
    container.style.display = 'block';
    if (selectedKey === "F#/Gb" || selectedKey === "D#/Ebm") {
      const img1 = document.createElement("img");
      img1.src = "img/fsharpmaj.png";
      img1.alt = "F# clef";
      img1.style.height = "70px";
      img1.style.marginRight = "5px";

      const img2 = document.createElement("img");
      img2.src = "img/gflatmaj.png";
      img2.alt = "Gb clef";
      img2.style.height = "70px";

      container.appendChild(img1);
      container.appendChild(img2);
    } else {
      const img = document.createElement("img");
      img.src = `img/${imageFile}`;
      img.alt = `${selectedKey} clef`;
      img.style.height = "70px";
      container.appendChild(img);
    }
  } else if (container) {
    container.style.display = 'none';
  }
}

export function initializeChordTippy() {
  console.log('✅ initializeChordTippy active');

  const chordCells = Array.from(document.querySelectorAll('.chord-cell'))
    .filter(cell => cell.dataset && cell.dataset.chord && cell.dataset.chord.trim() !== '');

  chordCells.forEach(cell => {
    if (cell._tippy) cell._tippy.destroy();
  });

  const activeInstances = new Map();

  tippy(chordCells, {
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    theme: 'light-border',
    animation: 'scale',
    delay: [0, 0],
    appendTo: document.body,
    hideOnClick: false,
    multiple: true,

    // Do NOT set global placement here! We set it dynamically in onShow.

    popperOptions(reference) {
      // No offset needed here; we'll set it below
      return {
        modifiers: [
          { name: 'preventOverflow', options: { boundary: 'viewport' } }
        ]
      };
    },

    content(reference) {
      const chord = reference.dataset.chord;
      const inner = document.createElement('div');
      inner.id = `popup-piano-${chord.replace(/\W+/g, '-')}`;
      return inner;
    },

    onShow(instance) {
      // ---- Set placement dynamically on mobile ----
      if (window.innerWidth < 700) {
        const columnType = instance.reference.dataset.column;
        // chord: above (top, arrow down), mirror: below (bottom, arrow up)
        if (columnType === "mirror") {
          instance.setProps({
            placement: "bottom",
            popperOptions: {
              modifiers: [
                { name: 'offset', options: { offset: [0, 8] } },
                { name: 'preventOverflow', options: { boundary: 'viewport' } }
              ]
            }
          });
        } else {
          instance.setProps({
            placement: "top",
            popperOptions: {
              modifiers: [
                { name: 'offset', options: { offset: [0, 8] } },
                { name: 'preventOverflow', options: { boundary: 'viewport' } }
              ]
            }
          });
        }
      }

      requestAnimationFrame(() => {
        const reference = instance.reference;
        const chord = reference.dataset.chord;
        const notes = getChordNotes(chord);

        // ==== ROOT POSITION LOGIC ====
        const NOTE_TO_INDEX = {
          'C': 0,  'C#': 1,  'Db': 1,
          'C##': 2, 'Dbb': 0,
          'D': 2,  'D#': 3,  'Eb': 3,
          'D##': 4, 'Ebb': 2,
          'E': 4,  'Fb': 4,  'E#': 5,
          'E##': 6, 'Fbb': 3,
          'F': 5,  'F#': 6,  'Gb': 6,
          'F##': 7, 'Gbb': 5,
          'G': 7,  'G#': 8,  'Ab': 8,
          'G##': 9, 'Abb': 7,
          'A': 9,  'A#': 10, 'Bb': 10,
          'A##': 11, 'Bbb': 9,
          'B': 11, 'Cb': 11, 'B#': 0,
          'B##': 1, 'Cbb': 10
        };

        const baseRootIndex = NOTE_TO_INDEX[notes[0]];
        const rootPositionIndices = notes.map((note, i) => {
          const interval = (NOTE_TO_INDEX[note] - NOTE_TO_INDEX[notes[0]] + 12) % 12;
          return baseRootIndex + interval;
        });

        const container = instance.popper.querySelector(`#popup-piano-${chord.replace(/\W+/g, '-')}`);
        if (container) {
          container.style.minHeight = "100px";
          container.style.width = "100%";
          renderUnifiedPiano({
            containerId: container.id,
            notes: rootPositionIndices,
            chordName: chord,
            compact: false,
            octaves: 2,
            inversion: 0
          });
        } else {
          console.error('Piano container not found:', container);
        }

        // Place the X in the .tippy-box itself (top-right of popup)
        const tippyBox = instance.popper.querySelector('.tippy-box');
        if (tippyBox) {
          let closeButton = tippyBox.querySelector('.tippy-close-btn');
          if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.className = 'tippy-close-btn';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '6px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'transparent';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '18px';
            closeButton.style.zIndex = '999';
            closeButton.addEventListener('click', (e) => {
              e.stopPropagation();
              instance.hide();
            });
            tippyBox.appendChild(closeButton);
          }
        }

        // --- Rest of your activeInstances logic ---
        const cell = instance.reference;
        const row = cell.closest('tr');
        const rowId = row.dataset.rowId;
        const columnType = cell.dataset.column;

        if (!activeInstances.has(rowId)) {
          activeInstances.set(rowId, { chord: null, mirror: null });
        }

        const instances = activeInstances.get(rowId);
        if (instances[columnType] && instances[columnType] !== instance) {
          instances[columnType].hide();
        }

        instances[columnType] = instance;

        for (let [id, pair] of activeInstances.entries()) {
          if (id !== rowId) {
            Object.values(pair).forEach(inst => inst?.hide?.());
            activeInstances.set(id, { chord: null, mirror: null });
          }
        }

        // Click outside to close
        const handleClickOutside = (e) => {
          if (!instance.popper.contains(e.target) && !e.target.closest('.chord-cell')) {
            instance.hide();
          }
        };

        document.addEventListener('click', handleClickOutside);
        instance._handleClickOutside = handleClickOutside;
      });
    },

    onHidden(instance) {
      const cell = instance.reference;
      const row = cell.closest('tr');
      const rowId = row.dataset.rowId;
      const columnType = cell.dataset.column;

      if (activeInstances.has(rowId)) {
        activeInstances.get(rowId)[columnType] = null;
      }

      document.removeEventListener('click', instance._handleClickOutside);
    }
  });
}


export function initializeTopChordPopups() {
  const topCells = Array.from(document.querySelectorAll('.top-chord-cell'))
    .filter(cell => cell.dataset && cell.dataset.chord && cell.dataset.chord.trim() !== '');

  topCells.forEach(cell => {
    if (cell._tippy) cell._tippy.destroy();
  });

  let openInstance = null; // Track the currently open instance

  tippy(topCells, {
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    theme: 'light-border',
    animation: 'scale',
    appendTo: document.body,
    hideOnClick: false,
    multiple: false, // This doesn't always enforce, so we do it manually

    popperOptions(reference) {
      return {
        modifiers: [
          { name: 'preventOverflow', options: { boundary: 'viewport' } }
        ]
      };
    },

    content(reference) {
      const chord = reference.dataset.chord;
      const inner = document.createElement('div');
      inner.id = `top-popup-piano-${chord.replace(/\W+/g, '-')}`;
      return inner;
    },

    onShow(instance) {
      // Close any previously open instance
      if (openInstance && openInstance !== instance) {
        openInstance.hide();
      }
      openInstance = instance;

      // Mobile: set placement (optional, adjust if you want "bottom" placement)
      if (window.innerWidth < 700) {
        instance.setProps({
          placement: "top",
          popperOptions: {
            modifiers: [
              { name: 'offset', options: { offset: [0, 8] } },
              { name: 'preventOverflow', options: { boundary: 'viewport' } }
            ]
          }
        });
      }

      requestAnimationFrame(() => {
        const chord = instance.reference.dataset.chord;
        const notes = getChordNotes(chord);

        // ROOT POSITION LOGIC
        const NOTE_TO_INDEX = {
          'C': 0,  'C#': 1,  'Db': 1,
          'C##': 2, 'Dbb': 0,
          'D': 2,  'D#': 3,  'Eb': 3,
          'D##': 4, 'Ebb': 2,
          'E': 4,  'Fb': 4,  'E#': 5,
          'E##': 6, 'Fbb': 3,
          'F': 5,  'F#': 6,  'Gb': 6,
          'F##': 7, 'Gbb': 5,
          'G': 7,  'G#': 8,  'Ab': 8,
          'G##': 9, 'Abb': 7,
          'A': 9,  'A#': 10, 'Bb': 10,
          'A##': 11, 'Bbb': 9,
          'B': 11, 'Cb': 11, 'B#': 0,
          'B##': 1, 'Cbb': 10
        };

        const baseRootIndex = NOTE_TO_INDEX[notes[0]];
        const rootPositionIndices = notes.map((note, i) => {
          const interval = (NOTE_TO_INDEX[note] - NOTE_TO_INDEX[notes[0]] + 12) % 12;
          return baseRootIndex + interval;
        });

        const container = instance.popper.querySelector(`#top-popup-piano-${chord.replace(/\W+/g, '-')}`);
        if (container) {
          container.style.minHeight = "100px";
          container.style.width = "100%";
          renderUnifiedPiano({
            containerId: container.id,
            notes: rootPositionIndices,
            chordName: chord,
            compact: true,
            octaves: 2,
            inversion: 0
          });
        } else {
          console.error('Piano container not found:', container);
        }

        // Add X close button
        const tippyBox = instance.popper.querySelector('.tippy-box');
        if (tippyBox) {
          let closeButton = tippyBox.querySelector('.tippy-close-btn');
          if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.textContent = '✖';
            closeButton.className = 'tippy-close-btn';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '6px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'transparent';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '18px';
            closeButton.style.zIndex = '999';
            closeButton.addEventListener('click', (e) => {
              e.stopPropagation();
              instance.hide();
            });
            tippyBox.appendChild(closeButton);
          }
        }

        // Hide on outside click
        const handleClickOutside = (e) => {
          if (!instance.popper.contains(e.target) && !e.target.closest('.top-chord-cell')) {
            instance.hide();
          }
        };
        document.addEventListener('click', handleClickOutside);
        instance._handleClickOutside = handleClickOutside;
      });
    },

    onHidden(instance) {
      document.removeEventListener('click', instance._handleClickOutside);
      if (openInstance === instance) openInstance = null;
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  renderCircleOfFifths();
  initializeChordTippy();
  initializeTopChordPopups();
});

export function onKeySelected(key) {
  updateClefImage(key);
  const isMinor = key.endsWith("m");
  if (window.expandedGroups) window.expandedGroups.clear();
  displayNegativeHarmonyChordChart(key, isMinor);
  requestAnimationFrame(() => {
    initializeChordTippy();
    initializeTopChordPopups();
  });
}

window.initializeChordTippy = initializeChordTippy;
window.initializeTopChordPopups = initializeTopChordPopups;
