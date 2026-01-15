import { openSidebar } from "./display.js"
import { DISTRICTS, map, storedResources, TERRAIN_INFO } from "./init.js"
import { buildBuilding, buildDistrict, getNextBuilding } from "./construction.js"
import { isResearched } from "./tech.js"
import { assignWorker, removeWorker } from "./workers.js"

// Handles click events

function clickTile(event) {
  let x = event.currentTarget.getAttribute("x")
  let y = event.currentTarget.getAttribute("y")
  updateInfoSidebar(x, y);
  openSidebar("info");
}

function yieldElement(name) {
  let img = document.createElement("img")
  img.src = `/static/images/icons/${name}.png`
  return img;
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
    for (let i = 0; i < value; i++) {
      tileYield.appendChild(yieldElement(key))
    }
  }
  if (!tileYield.hasChildNodes()) tileYield.innerHTML="None"

  const improvements = document.getElementById("improvements")
  improvements.innerHTML = "<h4>Improvements </h4>"

  if (tile["improvements"].length > 0) {
    improvements.style.display = "block"
    tile["improvements"].forEach((improvement) => {
      let ele = document.createElement("p")
      ele.innerHTML = improvement
      improvements.appendChild(ele);
    })
  } else {
    improvements.style.display = "none"
  }

  const possibleImprovements = document.getElementById("possible-improvements")
  const possibleDistricts = document.getElementById("possible-districts")
  const unitProduction = document.getElementById("unit-production")

  if (tile["owned"]) {
    possibleImprovements.innerHTML = '<h4>Construct Improvements</h4>'

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

    possibleDistricts.innerHTML = '<h4>Construct Districts</h4>'
    if (tile.district) {
      possibleDistricts.style.display = "none"
    } else {
      possibleDistricts.style.display = "block"
      TERRAIN_INFO[tile["terrain"]].possible_districts.forEach((district) => {
        const DISTRICT_INFO = DISTRICTS[district]
        if (!isResearched(DISTRICT_INFO["technology"])) return;
        let ele = document.createElement("button")
        ele.innerHTML = district
        ele.innerHTML += ` (${DISTRICT_INFO["production cost"]} Production)`
        ele.classList.add("sidebar-button");
        ele.addEventListener("click", (event) => {
          buildDistrict(district, x, y)
        })
        possibleDistricts.appendChild(ele)
      })

      // Append to possibleDistricts innerhtml with buttons like for improvements

    }

    if (tile.district == "encampment") {
      unitProduction.style.display = "block"
    } else {
      unitProduction.style.display = "none"
    }

    let div = document.getElementById("bad-naming")
    div.innerHTML = ""
    let ele = document.createElement("button")
    if (tile["worked"]) {
      ele.innerHTML = "Remove Worker"
      ele.addEventListener("click", (event) => {
        removeWorker(x, y)
      })
    } else {
      ele.innerHTML = "Assign Worker"
      ele.addEventListener("click", (event) => {
        assignWorker(x, y)
      })
    }
    div.appendChild(ele);
  } else {
    possibleImprovements.style.display = "none"
    possibleDistricts.style.display = "none"
    unitProduction.style.display = "none"
    //buy tile check adjacent tiles and if its owned
    const buyTile = document.getElementById("buy-tile");

  }
}

export { clickTile }
