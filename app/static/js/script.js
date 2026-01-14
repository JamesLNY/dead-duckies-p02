<<<<<<< HEAD
import { build } from "./construction.js"
import { map } from "./init.js";
=======
import { storedResources, map } from "./init.js"
>>>>>>> 231bb1eec43ea712bb9021f85e0bb6a7dfc66434

function clickTile(event) {
  let x = event.currentTarget.getAttribute("x")
  let y = event.currentTarget.getAttribute("y")

  updateInfoSidebar(map[y][x]);
  openInfoSidebar();
}

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
  if (tile.improvements.length > 0) {
    if (tile.improvements[0] == null) {html+= `<strong>Improvements: </strong>None`;}
    else{html += `<strong>Improvements: </strong><ul>`;}
    for (var i = 0; i < tile.improvements.length; i++) {
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


export { clickTile }
