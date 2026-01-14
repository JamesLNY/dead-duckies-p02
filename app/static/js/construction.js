import { getAdjacentTiles, consumeResource } from "./utility.js"
import { IMPROVEMENTS, DISTRICTS, map, TERRAIN_INFO, RESOURCE_YIELDS } from "./init.js"
import { overlay, getTileDiv } from "./display.js"
import { isResearched } from "./tech.js"

const ownedTiles = []

function gainedTile(x, y) {
  const tileDiv = getTileDiv(x, y)
  map[y][x].owned = true;
  tileDiv.firstElementChild.classList.add("tint-blue")
  ownedTiles.push({"x": x, "y": y})
}

function getPossibleImprovements(tile) {
  let output = []
  if (tile["improvement"].length != 0) return output;
  if (tile["resource"]) {
    if (RESOURCE_YIELDS[tile["resource"]]["technology"]) {
      if (!isResearched(RESOURCE_YIELDS[tile["resource"]]["technology"])) return output;
      output.push(RESOURCE_YIELDS[tile["resource"]]["improvement"])
    }
  }
  TERRAIN_INFO[tile["terrain"]]["possible_improvements"].forEach((improvement) => {
    if (isResearched(IMPROVEMENTS[improvement]["technology"])) {
      if (!(improvement in output)) {
        output.push(improvement);
      }
    }
  })
  return output;
}

function buildImprovement() {

}

function buildDistrict(name, x, y) {
  const TILE = map[y][x]

  TILE["yield"] = {}
  TILE["resource"] = name
  TILE["improvements"] = []

  overlay(x, y, `districts/${name}.png`, 0, "improvement")
  const district = DISTRICTS[name]
  consumeResource("production", district["production cost"])
  let adjacent = getAdjacentTiles(x, y)

  for (let [key, value] of Object.entries(district["adjacency"])) {
    adjacent.forEach((tile) => {
      let count = 0;
      if (tile["terrain"].includes(key)) count++
      if (tile["resource"] == key) count++
      if (tile["district"] == key) count++
      if (key in tile["improvements"]) count++
      if (count > 0) {
        for (let [resource, amount] of Object.entries(value)) {
          if (!TILE["yield"][resource]) {
            TILE["yield"][resource] = count * amount;
          } else {
            TILE["yield"][resource] += count * amount;
          }
        }
      }
    })
  }
}

function buildBuilding(name, x, y) {
  const TILE = map[x][y]
  TILE["improvements"].push(name)


}

export { buildDistrict, gainedTile, getPossibleImprovements, ownedTiles}