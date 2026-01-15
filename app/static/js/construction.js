import { getAdjacentTiles, consumeResource } from "./utility.js"
import { IMPROVEMENTS, DISTRICTS, map, TERRAIN_INFO, RESOURCE_YIELDS, storedResources } from "./init.js"
import { overlay, tintTile, closeSidebar } from "./display.js"
import { isResearched } from "./tech.js"
import { socket } from "./socket.js"

const ownedTiles = []

function gainedTile(x, y) {
  map[y][x].owned = true;
  ownedTiles.push({"x": x, "y": y})
  console.log(ownedTiles  )
  socket.emit("buy tile", {
    "x": x,
    "y": y
  })
  tintTile(x, y, "blue");
}

function getNextBuilding(tile) {
  const DISTRICT = DISTRICTS[tile["district"]]
  if (tile["improvements"].length >= DISTRICT["buildings"].length) return null;
  const next = DISTRICT["buildings"][tile["improvements"].length]
  if (next["technology"] && !isResearched(next["technology"])) return null
  return next;
}

function getPossibleImprovements(tile) {
  let output = []

  if (tile["improvements"].length != 0) return output;
  if (tile["resource"]) {
    if (RESOURCE_YIELDS[tile["resource"]]["technology"]) {
      if (!isResearched(RESOURCE_YIELDS[tile["resource"]]["technology"])) return output;
      if (storedResources["production"] >= IMPROVEMENTS[RESOURCE_YIELDS[tile["resource"]["improvement"]]]["production cost"]) {
        output.push(RESOURCE_YIELDS[tile["resource"]]["improvement"]);
      }
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
    if (!TILE["yield"][resource]) {
      TILE["yield"][resource] = 0;
    }
    TILE["yield"][resource] += amount;

  }
}

function removeImprovement(x, y) {
  const TILE = map[y][x];

  TILE["improvements"] = [];
}


function pillage(x, y, enemy = false) {
  const TILE = map[y][x];
  if (!enemy) {
      removeImprovements(x, y);
      if (TILE["improvements"].length != 0) {
        storedResources[IMPROVEMENTS[TILE["improvements"][0]]["plunder"]] += 100;
      }
      if (TILE["district"]) {
        storedResources[DISTRICT[TILE["district"]]["plunder"]] += 100;
      }
  }
}

function buildDistrict(name, x, y, enemy=false) {
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

export { buildDistrict, gainedTile, getPossibleImprovements, ownedTiles, buildBuilding, getNextBuilding }
