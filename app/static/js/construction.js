import { getJson, getAdjacentTiles, consumeResource, overlay } from "./utility.js"
import { map } from "./init.js"

const IMPROVEMENTS = await getJson("improvements.json")
const DISTRICTS = await getJson("districts.json")

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