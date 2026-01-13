import { getJson, overlay } from "./utility.js";

const STARTING_MAP = await getJson("map.json")
const TERRAIN_INFO = await getJson("terrain.json")
const RESOURCE_YIELDS = await getJson("resources.json")

let map = []

function tileYields(terrain, resource, improvements = []) {
  const tileYield = {food: 0, production: 0, gold: 0, science: 0};
  
  //terrain
  if (TERRAIN_INFO[terrain]) {
    tileYield.food = TERRAIN_INFO.food || 0;
    tileYield.production = TERRAIN_INFO.production || 0;
    tileYield.gold = TERRAIN_INFO.gold || 0;
    tileYield.science = TERRAIN_INFO.science || 0;
  }
  //resourcces
  if (resource && RESOURCE_YIELDS[resource]) {
    if (!RESOURCE_YIELDS[resource] || improvements.indexOf(RESOURCE_YIELDS[resource].improvement) !== -1) {
      tileYield.food += RESOURCE_YIELDS[resource].food || 0;
      tileYield.production += RESOURCE_YIELDS[resource].production || 0;
      tileYield.gold += RESOURCE_YIELDS[resource].gold || 0;
      tileYield.science += RESOURCE_YIELDS[resource].science || 0;
    }
  }
  return tileYield;
}
//frontend for reference
// {
//   "terrain_type": "plains",
//   "resource": null,
//   "improvements": [],
//   "unit": null,
//   "yield": {
//     "food": 1,
//     "production": 1
// }
function initMap() {
  for (let y = 0; y < STARTING_MAP.length; y++) {
    map[y] = [];
    for (let x = 0; x < STARTING_MAP.length; x++) {
      map[y][x] = {
        terrain: STARTING_MAP[y][x].terrain_type,
        resource: STARTING_MAP[y][x].resource,
        improvements: [],
        unit: null
      }
    }
  }
}

function renderMap() {
  const map = document.getElementById("map")
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50 - (y % 2); x++) {
      const div = document.createElement('div');
      div.style.position = "absolute"
      div.style.left = `${x * 112 + y % 2 * 56}px`;
      div.style.top = `${20 +   y * 95}px`;
      div.setAttribute("x", x);
      div.setAttribute("y", y);
      
      map.append(div);

      overlay(x, y, "Grassland.png", 90)
      overlay(x, y, "Grassland Hill.png", 0)
    }
  }
}

renderMap()

export { map }