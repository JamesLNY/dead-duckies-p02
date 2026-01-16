import { overlay, UNIT_DEFS, TERRAIN_INFO, map } from "./init.js";
import { openSidebar } from "./display.js";
import { socket } from "./socket.js";
import { pillage } from "./construction.js";
import { getAdjacentTiles } from "./utility.js";
import { CONST_OBJ } from "./game.js";

let myUnits = [];
let enemyUnits = [];
let selectedUnit = null;

function removeSelected() {
  selectedUnit = null;
}

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
    maxMovement: base.movement,
    combat: base.combat
  };

  if (owner === "player") {
    myUnits.push(unit);
    socket.emit("spawn unit", {
      "x": x,
      "y": y,
      "type": type,
      "name": name
    })
  } else {
    enemyUnits.push(unit);
  }

  if (map[y] && map[y][x]) {
    map[y][x].unit = unit;  
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

  img.onclick = (e) => {
    e.stopPropagation();
    if (unit["owner"] == "player" && CONST_OBJ["IS_TURN"]) {
      selectedUnit = unit;
    }
    showUnitSidebar(unit);
  };
}

function teleportUnit(startX, startY, endX, endY) {
  enemyUnits.forEach((unit) => {
    if (unit.x == startX && unit.y == startY) {
      moveUnit(unit, endX, endY)
    }
  })
}

function moveUnit(unit, targetX, targetY, enemy=false) {
  const tile = map[targetY]?.[targetX];
  if (tile.unit) return;
  if (!tile) return;

  let adj = getAdjacentTiles(unit.x, unit.y);
  let canMove = false;
  adj.forEach((t) => {
    if (t.x == targetX && t.y == targetY) canMove = true;
  })

  if (!canMove) return;

  if (!TERRAIN_INFO[tile["terrain"]]["movement"] || unit.movement < TERRAIN_INFO[tile["terrain"]]["movement"]) {
    return;
  }

  if (!enemy) {
    socket.emit("move unit", {
      "startX": unit.x,
      "startY": unit.y,
      "endX": targetX,
      "endY": targetY
    })
  }

  map[unit.y][unit.x].unit = null;

  unit.x = targetX;
  unit.y = targetY;

  tile.unit = unit;
  unit.movement -= TERRAIN_INFO[tile["terrain"]]["movement"];

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
  title.textContent = capitalize(unit.name);
  sidebar.appendChild(title);

  for (let key in unit) {
    if (["name", "x", "y", "type"].includes(key)) continue;

    sidebar.innerHTML += `
      <div>
        <strong>${capitalize(key)}: </strong><p>${unit[key]}</p>
      </div>
    `;
  }

  if (!CONST_OBJ["IS_TURN"]) return

  const pillageDiv = document.getElementById("pillage");
  if (map[unit["y"]][unit["x"]]["improvements"].length != 0
    && map[unit["y"]][unit["x"]]["owned"] === false ) {
    pillageDiv.innerHTML = "";
    let pillageBtn = document.createElement("button");
    pillageBtn.classList.add("sidebar-button")
    pillageBtn.innerHTML = "Pillage";
    pillageBtn.addEventListener("click", (event) => {
      pillage(unit["x"], unit["y"]);
    })
    pillageDiv.appendChild(pillageBtn);
  } else {
    pillageDiv.innerHTML = "";
  }
}

function redrawUnits() {
  document.querySelectorAll('img[src*="units/"]').forEach(img => img.remove());
  myUnits.forEach(drawUnit);
  enemyUnits.forEach(drawUnit);
}

//doesn't work right now
function restoreMovement() {
  if (myUnits && myUnits.length > 0) {
    myUnits.forEach(unit => {
      if (unit) unit.movement = unit.maxMovement;
    });
  }
  
  if (enemyUnits && enemyUnits.length > 0) {
    enemyUnits.forEach(unit => {
      if (unit) unit.movement = unit.maxMovement;
    });
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export {myUnits, enemyUnits, createUnit, drawUnit, redrawUnits, restoreMovement, teleportUnit, removeSelected};

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