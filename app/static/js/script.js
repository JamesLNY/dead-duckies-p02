import { openSidebar } from "./display.js"
import { map } from "./init.js"

// Handles click events

function clickTile(event) {
  let x = event.currentTarget.getAttribute("x")
  let y = event.currentTarget.getAttribute("y")
  updateInfoSidebar(map[y][x]);
  openSidebar("info");
}

function updateInfoSidebar(tile) {
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
  const possibleImprovements = document.getElementById("possible-improvements")

  if (tile.improvements.length == 0) {
    improvements.style.display = "none"
    possibleImprovements.style.display = "block"
    // Append to possible_improvements innerhtml with buttons

  } else {
    tile.improvements.forEach((improvement) => {
      // Create little box with information about the improvement
      improvements.innerHTML += `

      `
    })
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
