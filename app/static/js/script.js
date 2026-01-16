import { openSidebar } from "./display.js"
import { DISTRICTS, IMPROVEMENTS, map, storedResources, TERRAIN_INFO } from "./init.js"
import { gainedTile, buildImprovement, buildBuilding, getPossibleImprovements, buildDistrict, getNextBuilding, removeImprovement } from "./construction.js"
import { isResearched } from "./tech.js"
import { assignWorker, removeWorker } from "./workers.js"
import { getAdjacentTiles, consumeResource } from "./utility.js"
import { CONST_OBJ } from "./game.js"

// Handles click events

function clickTile(event) {
  let x = parseInt(event.currentTarget.getAttribute("x"))
  let y = parseInt(event.currentTarget.getAttribute("y"))
  updateInfoSidebar(x, y);
  openSidebar("info");
}

function imgElement(name) {
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
      tileYield.appendChild(imgElement(key))
    }
  }
  if (!tileYield.hasChildNodes()) tileYield.innerHTML="None"

  const improvements = document.getElementById("improvements")
  improvements.innerHTML = "<h4>Improvements </h4>"

  if (tile["improvements"].length > 0) {
    improvements.style.display = "block"
    tile["improvements"].forEach((improvement) => {
      let ele = document.createElement("p");
      ele.innerHTML = improvement
      improvements.appendChild(ele);
    })
  } else {
    improvements.style.display = "none"
  }

  const possibleImprovements = document.getElementById("possible-improvements")
  const possibleDistricts = document.getElementById("possible-districts")
  const unitProduction = document.getElementById("unit-production")
  const workerButtonDiv = document.getElementById("bad-naming")

  const buyDiv = document.getElementById("buy-tile");
  buyDiv.innerHTML = "";

  console.log(tile)

  if (tile["owned"] && CONST_OBJ["IS_TURN"]) {
    possibleImprovements.innerHTML = '<h4>Construct Improvements</h4>'

    if (tile["district"]) {
      possibleImprovements.style.display = "block"
      let next = getNextBuilding(tile);
      console.log("next")
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
        console.log(possibleImprovements)
      }
    } else if (tile.improvements.length == 0) {
      possibleImprovements.style.display = "block"
      //code for possible improvements
      //styling is likely messed up since i cant
      //test currently because its not showing up
      //on sidebar and im not sure why
      const improvements = getPossibleImprovements(tile);
      improvements.forEach((improvement) => {
        let btn = document.createElement("button");
        btn.classList.add("sidebar-button");
        btn.innerHTML =  `
          ${improvement}<br/>
          ${IMPROVEMENTS[improvement]["production cost"]} <img src="/static/images/icons/production.png">`;
        btn.addEventListener("click", (event) => {
          buildImprovement(improvement, x, y);
          updateInfoSidebar(x, y);
        })
        // Append to possible_improvements innerhtml with button
        possibleImprovements.appendChild(btn);
        possibleImprovements.appendChild(document.createElement("br"));
      });
    } else {
      let btn = document.createElement("button");
      btn.classList.add("sidebar-button")
      btn.innerHTML = "Remove Improvement"
      btn.addEventListener("click", (event) => {
        removeImprovement(x, y)
      })
      possibleImprovements.appendChild(btn)
    }
    if (possibleImprovements.innerHTML == '<h4>Construct Improvements</h4>') {
      console.log("HERE")
      possibleImprovements.style.display = "none"
    }

    possibleDistricts.innerHTML = '<h4>Construct Districts</h4>'
    if (tile.district) {
      possibleDistricts.style.display = "none"
    } else {
      possibleDistricts.style.display = "block"
      TERRAIN_INFO[tile["terrain"]].possible_districts.forEach((district) => {
        const DISTRICT_INFO = DISTRICTS[district]
        if (!isResearched(DISTRICT_INFO["technology"])) return;
        let ele = document.createElement("button");
        ele.classList.add("sidebar-button");
        ele.style.display = "flex";
        ele.style.flexDirection = "column";
        ele.innerHTML = district
        ele.innerHTML += `<br>${DISTRICT_INFO["production cost"]} <img src="/static/images/icons/production.png" style="width: 20px; height: 20px;">`;
        if (storedResources["production"] < DISTRICT_INFO["production cost"]) {
          ele.disabled = true;
        }
        ele.addEventListener("click", (event) => {
          buildDistrict(district, x, y)
          updateInfoSidebar(x, y);
        })
        // Append to possibleDistricts innerhtml with buttons like for improvements
        possibleDistricts.appendChild(ele);
        possibleDistricts.appendChild(document.createElement("br"));
      })
    }
    if (possibleDistricts.innerHTML == '<h4>Construct Districts</h4>') {
      possibleDistricts.style.display = "none"
    }

    // if (tile.district == "encampment") {
    //   unitProduction.style.display = "block"
    // } else {
    //   unitProduction.style.display = "none"
    // }

    
    workerButtonDiv.style.display = "block"
    workerButtonDiv.innerHTML = ""
    if (!tile["district"]) {
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
      workerButtonDiv.appendChild(ele);
    }
  } else {
    workerButtonDiv.style.display = "none"
    possibleImprovements.style.display = "none"
    possibleDistricts.style.display = "none"
    unitProduction.style.display = "none"

    if (tile["owned"] !== false && CONST_OBJ["IS_TURN"]) {
      if (getAdjacentTiles(x, y).some(tile => tile.owned)) {
        let buyBtn = document.createElement("button");
        buyBtn.innerHTML = "Buy Tile";
        buyBtn.appendChild(imgElement("gold"));
        buyBtn.innerHTML = "100";
        if (storedResources["gold"] < 100) {
          buyBtn.disabled = true;
        }
        buyBtn.addEventListener("click", (event) => {
          gainedTile(x, y);
          consumeResource("gold", 100);
        })
        buyDiv.appendChild(buyBtn);
      }
    }
  }
}

export { clickTile }
