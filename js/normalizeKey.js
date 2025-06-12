export const ENHARMONIC_KEY_MAP = {
  "F#/Gb": "F#",
  "Gb/F#": "F#",
  "D#/Eb": "Eb",
  "Eb/D#": "Eb"
};

export function normalizeKeyForChart(key) {
  const isMinor = key.endsWith("m");
  const strippedKey = isMinor ? key.slice(0, -1) : key;
  const normalizedKey = ENHARMONIC_KEY_MAP[strippedKey] || strippedKey;
  return { normalizedKey, isMinor };
}
