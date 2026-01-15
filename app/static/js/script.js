import { openSidebar } from "./display.js"
import { map, storedResources } from "./init.js"
import { buildBuilding, getNextBuilding } from "./construction.js"

// Handles click events

function clickTile(event) {
  let x = event.currentTarget.getAttribute("x")
  let y = event.currentTarget.getAttribute("y")
  updateInfoSidebar(x, y);
  openSidebar("info");
}

function updateInfoSidebar(x, y) {
  let tile = map[y][x]
  const tileTerrain = document.getElementById("tile-terrain")
  tileTerrain.innerHTML = tile.terrain

  const tileResource = document.getElementById("tile-resource")
  tileResource.innerHTML = tile.resource || "none"

  const tileDistrict = document.getElementById("tile-district")
  tileDistrict.innerHTML = tile.district || "none"

  const tileYield = document.getElementById("tile-yield")
  tileYield.innerHTML = ""

  for (let [key, value] of Object.entries(tile.yield)) {
    if (value != 0) {
      tileYield.innerHTML += `<li><strong>${key}: </strong>${value}</li>`
    }
  }

  const improvements = document.getElementById("improvements")
  improvements.innerHTML = "<strong>Improvements: </strong>"

  if (tile["improvements"].length > 0) {
    improvements.style.display = "block"
    tile["improvements"].forEach((improvement) => {
      // Create little box with information about the improvement
      improvements.innerHTML += improvement
    })
  } else {
    improvements.style.display = "none"
  }

  const possibleImprovements = document.getElementById("possible-improvements")
  possibleImprovements.innerHTML = ''

  if (tile["district"]) {
    let next = getNextBuilding(tile);
    if (next) {
      let ele = document.createElement("button")
      ele.innerHTML = next["name"]
      for (let [key, value] of Object.entries(next["yield"])) {
        ele.innerHTML += `<br>${key}: ${value}`
      }
      ele.classList.add("sidebar-button")
      if (next["production cost"] <= storedResources["production"]) {
        ele.addEventListener("click", (event) => {
          buildBuilding(next["name"], x, y)
        })
      } else {
        ele.disabled = true;
      }
      possibleImprovements.appendChild(ele)
    }
  } else if (tile.improvements.length == 0) {
    possibleImprovements.style.display = "block"
    // Append to possible_improvements innerhtml with button
  }

  const possibleDistricts = document.getElementById("possible-districts")
  if (tile.district) {
    possibleDistricts.style.display = "none"
  } else {
    // Append to possibleDistricts innerhtml with buttons like for improvements

  }

  const unitProduction = document.getElementById("unit-production")
  if (tile.district == "encampment") {
    unitProduction.style.display = "block"
  } else {
    unitProduction.style.display = "none"
  }
}

export { clickTile }
