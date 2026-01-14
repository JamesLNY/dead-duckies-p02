import { getJson, getAdjacentTiles, consumeResource, overlay } from "./utility.js"
import { map, TERRAIN_INFO, RESOURCE_YIELDS } from "./init.js"
import { isResearched } from "./tech.js"

const IMPROVEMENTS = await getJson("improvements.json")
const DISTRICTS = await getJson("districts.json")

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
  let tile = map[y][x]
  overlay(x, y, `districts/${name}.png`, 0, "improvement")
  const district = DISTRICTS[name]
  consumeResource("production", district["production cost"])
  let adjacent = getAdjacentTiles(x, y)

  for (let [key, value] of Object.entries(district["adjacency"])) {
    adjacent.forEach((tile) => {
      console.log(tile)
      let count = 0;
      if (tile["terrain"].includes(key)) count++
      if (key == tile) count++
      if (key in tile["improvements"]) count++
      for (let [resource, amount] of Object.entries(tile)) {
        tile["yield"][resource] = tile["yield"][resource] || 0 + count * amount
      }
    })
  }
}

export { buildDistrict }