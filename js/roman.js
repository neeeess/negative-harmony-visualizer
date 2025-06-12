import { MAJOR_NOTES, MINOR_NOTES } from './constants.js';

export const chordRomanNumeralsMajor = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
export const chordRomanNumeralsMinor = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

export function showRomanNumerals(rootNote, isMinor = false) {
  const svg = document.getElementById("circleSVG");
  if (!svg) return;

  document.querySelectorAll(".roman-label-group").forEach(el => el.remove());

  const majorKeys = MAJOR_NOTES;
  const minorKeys = MINOR_NOTES;

  const chordRomanNumeralsMajor = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  const chordRomanNumeralsMinor = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

  const keyList = isMinor ? minorKeys : majorKeys;
  const index = keyList.indexOf(rootNote);
  if (index === -1) return;

  const wedgeCount = 12;
  const anglePerWedge = (2 * Math.PI) / wedgeCount;
  const outerRadius = 200;
  const innerRadius = 130;

  function placePolarLabel(wedgeIndex, label, inner = false) {
    const angle = anglePerWedge * wedgeIndex - Math.PI / 2;
    const baseRadius = inner ? (innerRadius + 60) / 2 : (outerRadius + innerRadius) / 2;
    const offset = inner ? -30 : 40;
    const radius = baseRadius + offset;

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "roman-label-group");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "14");
    circle.setAttribute("fill", "#ffc94d");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 1);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", "12");
    text.setAttribute("fill", "#333");
    text.setAttribute("font-weight", "bold");
    text.textContent = label;

    group.appendChild(circle);
    group.appendChild(text);
    svg.appendChild(group);
  }

  if (isMinor) {
    placePolarLabel(index, "i", true);
    placePolarLabel((index + 2) % wedgeCount, "ii°", true);
    placePolarLabel((index - 1 + wedgeCount) % wedgeCount, "iv", true);
    placePolarLabel((index + 1) % wedgeCount, "v", true);
    placePolarLabel((index - 1 + wedgeCount) % wedgeCount, "VI", false);
    placePolarLabel((index + 1) % wedgeCount, "VII", false);
    placePolarLabel(index, "III", false);
  } else {
    placePolarLabel(index, "I");
    placePolarLabel((index - 1 + wedgeCount) % wedgeCount, "IV");
    placePolarLabel((index + 1) % wedgeCount, "V");
    placePolarLabel(index, "vi", true);
    placePolarLabel((index - 1 + wedgeCount) % wedgeCount, "ii", true);
    placePolarLabel((index + 1) % wedgeCount, "iii", true);
    placePolarLabel((index + 2) % wedgeCount, "vii°", true);
  }
}
