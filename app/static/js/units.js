import { overlay, UNIT_DEFS } from "./init.js";
import { openSidebar } from "./display.js";

let myUnits = [];
let enemyUnits = [];

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

  if (owner === "player") {
    myUnits.push(unit);
  } else {
    enemyUnits.push(unit);
  }

  if (map[x] && map[x][y]) {
    map[x][y].unit = unit;
    map[x][y].owned = owner;
  }

  drawUnit(unit);
  return unit;
}

function drawUnit(unit) {
    overlay(unit.x, unit.y, `units/${unit.name}.png`, 0, "unit");

    const div = document.querySelector(`div[x="${unit.x}"][y="${unit.y}"]`);
    if (!div) return;

    const imgs = div.querySelectorAll("img");
    const img = imgs[imgs.length - 1];
    if (!img) return;

    img.addEventListener("click", (event) => {
      event.stopPropagation()
      showUnitSidebar(unit);
    });

    img.style.zIndex = 5;
}

function showUnitSidebar(unit) {
  openSidebar("unit")

  const unitSidebar = document.querySelector("#unit-sidebar .sidebar-info");
  unitSidebar.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = unit.name;
  unitSidebar.appendChild(title);

  for (const key in unit) {
    if (["name", "x", "y", "type"].includes(key)) continue;

    const p = document.createElement("p");
    p.innerHTML = `<strong style="text-decoration: underline;">${capitalize(key)}:</strong> ${unit[key]}`;
    unitSidebar.appendChild(p);
  }
}

function clearSidebar() {
  const infoDiv = document.querySelector("#info-sidebar .sidebar-info");
  if (!infoDiv) return;

  while (infoDiv.firstChild) {
    infoDiv.removeChild(infoDiv.firstChild);
  }
}

function moveUnit(unit, targetX, targetY) {
  const tile = map[targetX]?.[targetY];
  if (!tile) return;

  if (Math.abs(unit.x - targetX) + Math.abs(unit.y - targetY) !== 1) return;

  map[unit.x][unit.y].unit = null; 
  unit.x = targetX;
  unit.y = targetY;
  tile.unit = unit;
  tile.owned = unit.owner;

  redrawUnits(); 
}

function redrawUnits() {
  myUnits.forEach(drawUnit);
  enemyUnits.forEach(drawUnit);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

createUnit("ranged", "archer", 1, 1, "hello")
export { myUnits, enemyUnits, createUnit, drawUnit, redrawUnits, clearSidebar };


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