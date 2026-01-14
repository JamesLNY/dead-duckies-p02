import { getJson, getAdjacentTiles } from "./utility.js"
import { map } from "./init.js"

const IMPROVEMENTS = await getJson("improvements.json")
const DISTRICTS = await getJson("districts.json")

function build() {

}

function buildDistrict(name, x, y) {
  let tile = map[y][x]
  const district = DISTRICTS[name]
  consumeResource("production", 54)
  let adjacent = getAdjacentTiles(x, y)

  for (let [key, value] of Object.entries(object)) {
    adjacent.forEach((tile) => {
      let count = 0;
      if (tile["terrain_type"].includes(key)) count++
      if (key == tile) count++
      if (key in tile["improvements"]) count++
      for (let [resource, amount] of Object.entries(tile)) {
        tile["yield"][resource] = tile["yield"][resource] || 0 + count * amount
      }
    })
  }
}

export { build }