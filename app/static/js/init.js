import { getJson, overlay } from "./utility.js";

const STARTING_MAP = await getJson("map.json")
const TERRAIN_INFO = await getJson("terrain.json")
const RESOURCE_YIELDS = await getJson("resources.json")

let storedResources = {
  "science": 0,
  "gold": 0,
  "food": 0,
  "production": 0,
  "population": 0,
  "iron": 0,
  "horses": 0,
  "niter": 0,
  "coal": 0
}

let resourcesPerTurn = {
  "science": 0,
  "gold": 0,
  "food": 0,
  "production": 0,
  "population": 0,
  "iron": 0,
  "horses": 0,
  "niter": 0,
  "coal": 0
}

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
    for (let x = 0; x < STARTING_MAP[y].length; x++) {
      // console.log(STARTING_MAP[y][x])
      map[y][x] = {
        //improvements and units aren't in map.json
        //but it's here js in case we may add it later
        terrain: STARTING_MAP[y][x].terrain_type,
        resource: STARTING_MAP[y][x].resource,
        improvements: STARTING_MAP[y][x].improvements || [],
        unit: STARTING_MAP[y][x].unit || null,
        yield: tileYields(STARTING_MAP[y][x].terrain_type, STARTING_MAP[y][x].resource, STARTING_MAP[y][x].improvements)
      };
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

      overlay(x, y, "tiles/grassland.png", 90)
      overlay(x, y, "tiles/rainforest.png", 0)
      // overlay(x, y, "units/archer.png", 0)
    }
  }
}

initMap()
renderMap()

export { map, storedResources, resourcesPerTurn }