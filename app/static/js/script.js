import { map } from "./init.js"
import { buildDistrict, gainedTile } from "./construction.js";
import { CONST_OBJ } from "./socket.js"
import { getAdjacentTiles } from "./utility.js";

function clickTile(event) {
  let x = event.currentTarget.getAttribute("x")
  let y = event.currentTarget.getAttribute("y")

  updateInfoSidebar(map[y][x]);
  openInfoSidebar();
}
// ADD UNITS ON INFO SIDEBAR
function updateInfoSidebar(tile) {
  const content = document.getElementById("info-content");
  content.innerHTML = "";

  let html = `<strong>Tile Information</strong><br><br>
  <strong>Terrain: </strong>${tile.terrain}<br>`;
  if (tile.resource) {html += `<strong>Resource: </strong>${tile.resource}<br>`;}
  else {html+= `<strong>Resource: </strong>None<br>`;}
  html += `<strong>Yield: </strong>
  <ul>
    <li><strong>Food: </strong>${tile.yield.food}</li>
    <li><strong>Production: </strong>${tile.yield.production}</li>
    <li><strong>Gold: </strong>${tile.yield.gold}</li>
    <li><strong>Science: </strong>${tile.yield.science}</li>
  </ul>`;
  //remember to change this, districts no longer improvements 
  //also have to change in init
  if (tile.improvements.length > 0) {
    if (tile.improvements[0] == null) {html+= `<strong>Improvements: </strong>None`;}
    else{html += `<strong>Improvements: </strong><ul>`;}
    for (var i = 1; i < tile.improvements.length; i++) {
      html += `<li>${tile.improvements[i]}</li>`;
    }
    html += `</ul>`;
  }

  content.innerHTML = html;
}

function openInfoSidebar() {
  const infoSidebar = document.getElementById("info-sidebar");
  const techSidebar = document.getElementById("tech-sidebar");
  if (infoSidebar.classList.contains("closed")) {
    infoSidebar.classList.add("opened");
    infoSidebar.classList.remove("closed");
    techSidebar.classList.add("closed");
    techSidebar.classList.remove("opened");
  }
}

function startGame() {
  let adjacent
  if (CONST_OBJ["IS_TURN"]) {
    buildDistrict("city center", 2, 1)
    gainedTile(2, 1)
    adjacent = getAdjacentTiles(2, 1)
  } else {
    buildDistrict("city center", 21, 1)
    gainedTile(21, 1)
    adjacent = getAdjacentTiles(21, 1)
  }
  adjacent.forEach((tile) => {
    console.log(tile)
    gainedTile(tile["x"], tile["y"])
  })
}

function endTurn() {
  if (!CONST_OBJ["IS_TURN"]) return;
  map.forEach((row) => {
    row.forEach((tile) => {

    })
  })
}

export { clickTile, endTurn, startGame }
