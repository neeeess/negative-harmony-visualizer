// unifiedPiano.js
import { KEY_LAYOUT } from './piano.js';

export function renderUnifiedPiano({
  containerId,
  notes = [],
  compact = false,
  scaleLabels = null,
  preferFlats = false,
  chordName = '',
  noteClickHandler = null,
  octaves = 1
}) {

    console.log('[UnifiedPiano] KEY_LAYOUT:', KEY_LAYOUT);

  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  console.log('[UnifiedPiano] container:', container);
  const wrapper = document.createElement('div');
  wrapper.classList.add('piano-wrapper');
  if (compact) wrapper.classList.add('compact');

  const whiteRow = document.createElement('div');
  whiteRow.classList.add('white-row');

  // For labels on highlighted keys
  let highlightLabelMap = {};
  if (scaleLabels && notes.length === scaleLabels.length) {
    notes.forEach((noteIdx, i) => {
      highlightLabelMap[noteIdx] = scaleLabels[i];
    });
  }

  // White key positions per octave
  const WHITE_KEY_OFFSETS = [0, 2, 4, 5, 7, 9, 11];

  // For each octave, render white keys, and (inside each white key) render a black key if needed
  for (let octave = 0; octave < octaves; octave++) {
    for (let w = 0; w < WHITE_KEY_OFFSETS.length; w++) {
      const whiteIdx = octave * 12 + WHITE_KEY_OFFSETS[w];
      const key = KEY_LAYOUT[whiteIdx];
      const isActive = notes.includes(whiteIdx);

      // White key
      const whiteDiv = document.createElement('div');
      whiteDiv.classList.add('white-key');
      if (isActive) whiteDiv.classList.add('highlight');

      if (noteClickHandler) {
        whiteDiv.style.cursor = 'pointer';
        whiteDiv.addEventListener('click', () => noteClickHandler(whiteIdx));
      }

      // Label (highlighted, allow for compact as well)
      if (isActive && highlightLabelMap[whiteIdx]) {
        const span = document.createElement('span');
        span.className = 'note-label';
        span.textContent = Array.isArray(highlightLabelMap[whiteIdx])
          ? highlightLabelMap[whiteIdx].join('\n')
          : highlightLabelMap[whiteIdx];
        whiteDiv.appendChild(span);

        // Debug: Show which keys get labels
        console.log(
          `[UnifiedPiano] Added label "${span.textContent}" for key index ${whiteIdx} (container: ${containerId})`
        );
      }

      // Insert black key for C, D, F, G, A (not after E, B)
      // Black key comes after C (C#), D (D#), F (F#), G (G#), A (A#)
      // So, if not the last white key in octave
      if (w !== 2 && w !== 6) { // not after E or B
        const blackIdx = whiteIdx + 1;
        const isActiveBlack = notes.includes(blackIdx);
        const keyBlack = KEY_LAYOUT[blackIdx];

        const blackDiv = document.createElement('div');
        blackDiv.classList.add('black-key');
        if (isActiveBlack) blackDiv.classList.add('highlight');

        // Label for black key (allow for compact as well)
        if (isActiveBlack && highlightLabelMap[blackIdx]) {
          const span = document.createElement('span');
          span.className = 'note-label black-label';
          span.textContent = Array.isArray(highlightLabelMap[blackIdx])
            ? highlightLabelMap[blackIdx].join('\n')
            : highlightLabelMap[blackIdx];
          blackDiv.appendChild(span);

          // Debug: Show which black keys get labels
          console.log(
            `[UnifiedPiano] Added label "${span.textContent}" for black key index ${blackIdx} (container: ${containerId})`
          );
        }

        // Black key click
        if (noteClickHandler) {
          blackDiv.style.cursor = 'pointer';
          blackDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            noteClickHandler(blackIdx);
          });
        }

        // Absolutely position black key within white key
        whiteDiv.appendChild(blackDiv);
      }

      whiteRow.appendChild(whiteDiv);
    }
  }

  wrapper.appendChild(whiteRow);
  container.appendChild(wrapper);
  console.log('[UnifiedPiano] container.innerHTML after render:', container.innerHTML);
}
