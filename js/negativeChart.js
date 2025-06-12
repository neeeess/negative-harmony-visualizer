import { getMirrorTableForKey } from './generateChordName.js';
import { normalizeKeyForChart } from './normalizeKey.js';

let showOnlyDiatonic = false;
let showAllActive = false;
let currentKey = "C";
window.window.expandedGroups = new Set();

export function displayNegativeHarmonyChordChart(key) {
  currentKey = key;
  const { normalizedKey, isMinor } = normalizeKeyForChart(currentKey);
  const container = document.getElementById("negativeChordTable");
  const wrapper = document.getElementById("negativeHarmonyChart");
  const allBtn = document.getElementById("showAllBtn");
  const diaBtn = document.getElementById("showDiatonicBtn");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("chord-table");

  const header = table.insertRow();
  header.innerHTML = `
    <th>Root Group</th>
    <th>Roman</th>
    <th>Chord</th>
    <th>Mirror Roman</th>
    <th>Mirror Chord</th>
  `;

  const tableRows = getMirrorTableForKey(currentKey);

  const majorSet = new Set(["I", "ii", "iii", "IV", "V", "vi", "vii°"]);
  const minorSet = new Set(["i", "ii°", "III", "iv", "v", "VI", "VII"]);
  const highlightSet = currentKey.endsWith("m") ? minorSet : majorSet;

  const diatonicRootGroups = new Set(
    tableRows.filter(row => highlightSet.has(row.roman)).map(row => row.rootGroup)
  );

  const groupedRows = new Map();
  tableRows.forEach(row => {
    if (!groupedRows.has(row.rootGroup)) {
      groupedRows.set(row.rootGroup, []);
    }
    groupedRows.get(row.rootGroup).push(row);
  });

  const rowsToRender = [];
  const firstDiatonicInGroup = new Map();

  groupedRows.forEach((rows, group) => {
    const diatonicRow = rows.find(row => highlightSet.has(row.roman));
    if (diatonicRow) firstDiatonicInGroup.set(group, diatonicRow.roman);

    if (showOnlyDiatonic) {
      rows.forEach(row => {
        if (highlightSet.has(row.roman)) rowsToRender.push(row);
      });
    } else if (showAllActive || window.expandedGroups.has(group)) {
      rowsToRender.push(...rows);
    } else {
      const preferred = diatonicRow || rows[0];
      if (preferred) rowsToRender.push(preferred);
    }
  });

  let lastRootGroup = null;

  if (isMinor) {
    const dividerRow = table.insertRow();
    dividerRow.classList.add("section-divider");
    dividerRow.innerHTML = `<td colspan="5">Minor Key Chords</td>`;
  }

  rowsToRender.forEach((rowData, i) => {
    const { rootGroup, roman, chord, mirrorRoman, mirrorChord } = rowData;
    const isNewGroup = rootGroup !== lastRootGroup;
    const nextGroup = rowsToRender[i + 1]?.rootGroup;
    const isLastInGroup = nextGroup !== rootGroup;
    lastRootGroup = rootGroup;

    const row = table.insertRow();
    row.dataset.rowId = i; // <-- ✅ This was the missing piece!

    if (isNewGroup && (window.expandedGroups.has(rootGroup) || showAllActive)) {
      row.classList.add("root-group-start");
    }

    const isDiatonicGroup = diatonicRootGroups.has(rootGroup);
    const isFirstDiatonic = firstDiatonicInGroup.get(rootGroup) === roman;

    if (isDiatonicGroup && !showOnlyDiatonic) {
      if (isFirstDiatonic) {
        row.classList.add("highlight-row");
      } else {
        row.classList.add("highlight-row-light");
      }
    }

    if (isLastInGroup && (window.expandedGroups.has(rootGroup) || showAllActive)) {
      row.classList.add("root-group-end");
    }

    const isExpanded = window.expandedGroups.has(rootGroup) || showAllActive;
    const icon = isExpanded ? "▾" : "▸";

    row.innerHTML = `
      <td class="clickable-root" data-root="${rootGroup}">${icon} ${rootGroup}</td>
      <td>${roman}</td>
      <td class="chord-cell" data-chord="${chord}" data-column="chord">${chord}</td>
      <td>${mirrorRoman}</td>
      <td class="chord-cell" data-chord="${mirrorChord}" data-column="mirror">${mirrorChord}</td>
    `;

  });

  container.appendChild(table);

  window.initializeChordTippy?.();
  wrapper.style.display = "block";

  if (!showOnlyDiatonic && !showAllActive) {
    allBtn.classList.remove("active");
    diaBtn.classList.remove("active");
  }

  if (allBtn && !allBtn.dataset.bound) {
    allBtn.addEventListener("click", () => {
      if (showAllActive) {
        showAllActive = false;
        allBtn.classList.remove("active");
      } else {
        showOnlyDiatonic = false;
        showAllActive = true;
        window.expandedGroups.clear();
        allBtn.classList.add("active");
        diaBtn.classList.remove("active");
      }
      displayNegativeHarmonyChordChart(currentKey);
      setTimeout(() => {
        requestAnimationFrame(() => {
          window.initializeChordTippy?.();
        });
      }, 0);
    });

    diaBtn.addEventListener("click", () => {
      if (showOnlyDiatonic) {
        showOnlyDiatonic = false;
        diaBtn.classList.remove("active");
      } else {
        showOnlyDiatonic = true;
        showAllActive = false;
        window.expandedGroups.clear();
        diaBtn.classList.add("active");
        allBtn.classList.remove("active");
      }
      displayNegativeHarmonyChordChart(currentKey);
      setTimeout(() => {
        requestAnimationFrame(() => {
          window.initializeChordTippy?.();
        });
      }, 0);
    });

    allBtn.dataset.bound = diaBtn.dataset.bound = true;
  }

  table.querySelectorAll(".clickable-root").forEach(cell => {
    cell.addEventListener("click", () => {
      const group = cell.dataset.root;
      if (window.expandedGroups.has(group)) {
        window.expandedGroups.delete(group);
      } else {
        window.expandedGroups.add(group);
      }
      showOnlyDiatonic = false;
      showAllActive = false;
      allBtn.classList.remove("active");
      diaBtn.classList.remove("active");
      displayNegativeHarmonyChordChart(currentKey);
      setTimeout(() => {
        requestAnimationFrame(() => {
          window.initializeChordTippy?.();
        });
      }, 0);
    });
  });

  // 🚨 Removed conflicting Tippy initialization.
  // (handled in main.js)
}
