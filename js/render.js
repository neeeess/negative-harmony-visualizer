const OUTER_RADIUS = 200;
const INNER_RADIUS = 130;
const MINOR_INNER_RADIUS = 60;
const MINOR_OUTER_RADIUS = 130;
const CENTER_X = 0;
const CENTER_Y = 0;

import { MAJOR_NOTES, MINOR_NOTES } from './constants.js';
import { displayChords } from './chords.js';
import { onKeySelected } from './main.js';

export function renderCircleOfFifths() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "-250 -250 500 500");
  svg.setAttribute("id", "circleSVG");
  svg.style.width = "500px";
  svg.style.height = "500px";

  const wedgeAngle = (2 * Math.PI) / MAJOR_NOTES.length;

  MAJOR_NOTES.forEach((note, i) => {
    const startAngle = i * wedgeAngle - wedgeAngle / 2 - Math.PI / 2;
    const endAngle = startAngle + wedgeAngle;
    const path = createWedgePath(startAngle, endAngle, INNER_RADIUS, OUTER_RADIUS);
    const outerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outerPath.setAttribute("d", path);
    outerPath.setAttribute("class", "wedge");
    outerPath.addEventListener("click", () => {
      displayChords(note, false);
      console.log("Selected key:", note);
      onKeySelected(note);
    });
    svg.appendChild(outerPath);

    const labelAngle = startAngle + wedgeAngle / 2;
    const rLabel = (OUTER_RADIUS + INNER_RADIUS) / 2;
    const x = rLabel * Math.cos(labelAngle);
    const y = rLabel * Math.sin(labelAngle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("class", "major");
    text.textContent = note;
    svg.appendChild(text);
  });

  MINOR_NOTES.forEach((note, i) => {
    const startAngle = i * wedgeAngle - wedgeAngle / 2 - Math.PI / 2;
    const endAngle = startAngle + wedgeAngle;
    const path = createWedgePath(startAngle, endAngle, MINOR_INNER_RADIUS, MINOR_OUTER_RADIUS);
    const innerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    innerPath.setAttribute("d", path);
    innerPath.setAttribute("class", "inner-wedge");

    innerPath.addEventListener("click", () => {
      displayChords(note, true);
      const formattedNote = note.charAt(0).toUpperCase() + note.slice(1);
      console.log("Selected key:", formattedNote);
      onKeySelected(formattedNote);
    });

    svg.appendChild(innerPath);

    const labelAngle = startAngle + wedgeAngle / 2;
    const rLabel = (MINOR_INNER_RADIUS + MINOR_OUTER_RADIUS) / 2;
    const x = rLabel * Math.cos(labelAngle);
    const y = rLabel * Math.sin(labelAngle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("class", "minor");
    if (note === "D#/Ebm") {
      const tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan1.setAttribute("x", x);
      tspan1.setAttribute("dy", "-0.4em");
      tspan1.textContent = "D#m/";
    
      const tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan2.setAttribute("x", x);
      tspan2.setAttribute("dy", "1.2em");
      tspan2.textContent = "Ebm";
    
      text.appendChild(tspan1);
      text.appendChild(tspan2);
    } else {
      text.textContent = note;
    }
    svg.appendChild(text);
  });

  addCircleToDOM(svg);
}

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

function addCircleToDOM(svg) {
  const container = document.getElementById("circle-container") || document.body;
  container.innerHTML = "";
  container.appendChild(svg);
}
