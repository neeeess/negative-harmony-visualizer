// chordPiano.js

import { renderUnifiedPiano } from './unifiedPiano.js';

export function renderMiniPiano(notes, chordName) {
  const containerId = `popup-piano-${chordName.replace(/\W+/g, '-')}`;
  setTimeout(() => {
    renderUnifiedPiano({
      containerId,
      notes,
      chordName,
      compact: true
    });
  }, 0);

  const container = document.createElement('div');
  container.id = containerId;
  return container;
}
