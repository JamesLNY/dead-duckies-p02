//  DeadDuckies
//  Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
//  SoftDev pd4
//  2026-01-16f

import { getAdjacentTiles, consumeResource, gainResource } from "./utility.js"
import { IMPROVEMENTS, DISTRICTS, map, TERRAIN_INFO, RESOURCE_YIELDS, storedResources } from "./init.js"
import { overlay, tintTile, closeSidebar } from "./display.js"
import { isResearched } from "./tech.js"
import { socket } from "./socket.js"

const ownedTiles = []

function gainedTile(x, y) {
  map[y][x].owned = true;
  ownedTiles.push({"x": x, "y": y})
  socket.emit("buy tile", {
    "x": x,
    "y": y
  })
  tintTile(x, y, "blue");
  closeSidebar()
}

function getNextBuilding(tile) {
  const DISTRICT = DISTRICTS[tile["district"]]
  if (tile["improvements"].length >= DISTRICT["buildings"].length) return null;
  const next = DISTRICT["buildings"][tile["improvements"].length]
  if (next["technology"] && !isResearched(next["technology"])) return null
  return next;
}

function removeImprovement(x, y, enemy=false) {
  closeSidebar()
  console.log("HERE")
  let tile = map[y][x]
  let improvement = IMPROVEMENTS[tile["improvements"].at(-1)]
  for (let [resource, amount] of Object.entries(improvement["bonuses"])) {
    tile["yield"][resource] -= amount;
  }
  tile["improvements"].pop(0)
  if (!enemy) {
    socket.emit(
      "remove improvement", {
        "x": x,
        "y": y
      }
    )
  }
}

function getPossibleImprovements(tile) {
  let output = []
  if (tile["improvements"].length != 0) return output;
  if (tile["resource"]) {
    if (RESOURCE_YIELDS[tile["resource"]]["technology"] 
      && !isResearched(RESOURCE_YIELDS[tile["resource"]]["technology"])
    ) {
      return;
    } 
    if (IMPROVEMENTS[RESOURCE_YIELDS[tile["resource"]]["improvement"]]["technology"]
      && isResearched(IMPROVEMENTS[RESOURCE_YIELDS[tile["resource"]]["improvement"]]["technology"])
    ) {
      output.push(RESOURCE_YIELDS[tile["resource"]]["improvement"]);
    }
    if (!IMPROVEMENTS[RESOURCE_YIELDS[tile["resource"]]["improvement"]]["technology"]) {
      output.push(RESOURCE_YIELDS[tile["resource"]]["improvement"]);
    }
  }
  TERRAIN_INFO[tile["terrain"]]["possible_improvements"].forEach((improvement) => {
    if (isResearched(IMPROVEMENTS[improvement]["technology"])) {
      if (!output.includes(improvement)) {
        output.push(improvement);
      }
    }
  })

  return output;
}

function buildImprovement(name, x, y, enemy=false) {
  closeSidebar()
  const TILE = map[y][x];
  TILE["improvements"] = [name];

  const improvement = IMPROVEMENTS[name];

  if (!enemy) {
    consumeResource("production", improvement["production cost"]);
    socket.emit("build improvement", {
      "name": name,
      "x": x,
      "y": y
    });
  }

  for (let [resource, amount] of Object.entries(improvement["bonuses"])) {
    TILE["yield"][resource] += amount;
  }
}

function pillage(x, y) {
  closeSidebar()
  const TILE = map[y][x];

  if (TILE.owned == false) {
    if (TILE["improvements"].length != 0) {
      gainResource(IMPROVEMENTS[TILE["improvements"].at(-1)]["plunder"], 100);
      removeImprovement(x, y);
    }
    if (TILE["district"]) {
      gainResource(DISTRICTS[TILE["district"]]["plunder"], 100);
    }
  }
}

function buildDistrict(name, x, y, enemy=false) {
  closeSidebar()
  const TILE = map[y][x]

  for (let [key, value] of Object.entries(TILE["yield"])) {
    TILE["yield"][key] = 0
  }

  TILE["district"] = name
  TILE["improvements"] = []

  overlay(x, y, `districts/${name}.png`, 0, "resource")
  const district = DISTRICTS[name]

  if (!enemy) {
    consumeResource("production", district["production cost"])
    socket.emit("build district", {
      "name": name,
      "x": x,
      "y": y,
    })
  }

  let adjacent = getAdjacentTiles(x, y)

  for (let [key, value] of Object.entries(district["adjacency"])) {
    adjacent.forEach((tile) => {
      let count = 0;
      if (tile["terrain"].includes(key)) count++
      if (tile["resource"] == key) count++
      if (tile["district"] == key) count++
      if (key in tile["improvements"]) count++
      for (let [resource, amount] of Object.entries(value)) {
        if (!TILE["yield"][resource]) {
          TILE["yield"][resource] = 0;
        }
        TILE["yield"][resource] += count * amount;
      }
    })
  }
  console.log(TILE)
}

function buildBuilding(name, x, y, enemy=false) {
  closeSidebar()
  const TILE = map[y][x]
  console.log(TILE)
  TILE["improvements"].push(name)

  console.log(TILE["district"])

  const building = DISTRICTS[TILE["district"]]["buildings"].find(e => e["name"] === name)

  if (!enemy) {
    consumeResource("production", building["production cost"])
    socket.emit("build building", {
      "district": TILE["district"],
      "name": name,
      "x": x,
      "y": y,
    })
  }

  for (let [key, value] of Object.entries(building["yield"])) {

    TILE["yield"][key] += parseInt(value);
  }
}

export { buildDistrict, pillage, gainedTile, getPossibleImprovements, ownedTiles, buildBuilding, getNextBuilding, buildImprovement, removeImprovement }
