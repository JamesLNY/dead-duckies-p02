import { overlay, UNIT_DEFS, map } from "./init.js";
import { openSidebar } from "./display.js";

let myUnits = [];
let enemyUnits = [];
let selectedUnit = null;

function createUnit(type, name, x, y, owner) {
  const base = UNIT_DEFS[type][name].base;
  const unit = {
    type,
    name,
    owner,
    x,
    y,
    health: 100,
    movement: base.movement,
    combat: base.combat
  };

  if (owner === "player") myUnits.push(unit);
  else enemyUnits.push(unit);

  if (map[y] && map[y][x]) {
    map[y][x].unit = unit;
    map[y][x].owned = owner;
  }

  drawUnit(unit);
  return unit;
}

function drawUnit(unit) {
  overlay(unit.x, unit.y, `units/${unit.name}.png`, 0, "unit");

  const div = document.querySelector(`div[x="${unit.x}"][y="${unit.y}"]`);
  if (!div) return;

  const img = div.querySelector("img:last-child");
  if (!img) return;

  img.style.zIndex = 5;

<<<<<<< HEAD
  img.onclick = (e) => {
    e.stopPropagation();
    selectedUnit = unit;
    showUnitSidebar(unit);
  };
=======
function clearSidebar() {
  const infoDiv = document.querySelector("#info-sidebar .sidebar-info");
  if (!infoDiv) return;

  while (infoDiv.firstChild) {
    infoDiv.removeChild(infoDiv.firstChild);
  }
>>>>>>> b7762ff54fd7aebcea6ea85a7034dcf53ca14dba
}

function moveUnit(unit, targetX, targetY) {
  const tile = map[targetY]?.[targetX];
  if (!tile) return;

  if (Math.abs(unit.x - targetX) + Math.abs(unit.y - targetY) !== 1) return;

  map[unit.y][unit.x].unit = null;

  unit.x = targetX;
  unit.y = targetY;

  tile.unit = unit;
  tile.owned = unit.owner;

  redrawUnits();
}

document.addEventListener("click", (e) => {
  if (!selectedUnit) return;

  const tile = e.target.closest("div[x][y]");
  if (!tile) return;

  const x = Number(tile.getAttribute("x"));
  const y = Number(tile.getAttribute("y"));

  moveUnit(selectedUnit, x, y);
  selectedUnit = null;
});

function showUnitSidebar(unit) {
  openSidebar("unit");

  const sidebar = document.querySelector("#unit-sidebar .sidebar-info");
  sidebar.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = unit.name;
  sidebar.appendChild(title);

  for (const key in unit) {
    if (["name", "x", "y", "type"].includes(key)) continue;

    const p = document.createElement("p");
    p.innerHTML = `<strong>${capitalize(key)}:</strong> ${unit[key]}`;
    sidebar.appendChild(p);
  }
}

function redrawUnits() {
  document.querySelectorAll('img[src*="units/"]').forEach(img => img.remove());
  myUnits.forEach(drawUnit);
  enemyUnits.forEach(drawUnit);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

createUnit("ranged", "archer", 1, 1, "player");

export {myUnits, enemyUnits, createUnit, drawUnit, redrawUnits};

/* comment for reference
//units table
    //DROP TABLE IF EXISTS units;
    //CREATE TABLE units (
    //    game INTEGER,
    ///    owner TEXT,
    //    x_pos INTEGER,
    //    y_pos INTEGER,
    //    name TEXT,
    //    health INTEGER,
    //    FOREIGN KEY (game) REFERENCES games(id),
    //    FOREIGN KEY (owner) REFERENCES profiles(username)
    //);
*/
