import { getJson, overlay, getAdjacentTiles } from "./utility.js";
import { clickTile } from "./script.js";

const STARTING_MAP = await getJson("map.json")
const TERRAIN_INFO = await getJson("terrain.json")
const RESOURCE_YIELDS = await getJson("resources.json")

let storedResources = {
  "science": 100,
  "gold": 0,
  "food": 0,
  "production": 4,
  "population": 0,
  "iron": 0,
  "horses": 0,
  "niter": 0,
  "coal": 0
}

// INITIALIZING RESOURCE UI
for (let [key, value] of Object.entries(storedResources)) {
  let resource = document.getElementById(key)
  resource.innerHTML = value
}

// INITIALIZING MAP

let map = []

function tileYields(terrain, resource, improvements = []) {
  const tileYield = {food: 0, production: 0, gold: 0, science: 0};

  //terrain
  if (TERRAIN_INFO[terrain]) {
    tileYield.food = TERRAIN_INFO[terrain].food || 0;
    tileYield.production = TERRAIN_INFO[terrain].production || 0;
    tileYield.gold = TERRAIN_INFO[terrain].gold || 0;
    tileYield.science = TERRAIN_INFO[terrain].science || 0;
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

//what frontend looks like for reference
// {
//   "terrain_type": "plains",
//   "resource": null,
//   "improvements": [],
//   "unit": null,
//   "yield": {
//     "food": 1,
//     "production": 1
//   }
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
        improvements: STARTING_MAP[y][x].improvements || [null],
        unit: STARTING_MAP[y][x].unit || null,
        yield: tileYields(STARTING_MAP[y][x].terrain_type, STARTING_MAP[y][x].resource, STARTING_MAP[y][x].improvements)
      };
    }
  }
}

function renderMap() {
  const mapDiv = document.getElementById("map")
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const div = document.createElement('div');
      div.style.position = "absolute"
      div.style.left = `${x * 112 + y % 2 * 56}px`;
      div.style.top = `${20 +   y * 95}px`;
      div.setAttribute("x", x);
      div.setAttribute("y", y);

      mapDiv.append(div);

      for (var i = 0; i < TERRAIN_INFO[map[y][x].terrain].terrain.length; i++) {
        var rotation = (i == 0) ? 90 : 0;

        overlay(x, y, `tiles/${TERRAIN_INFO[map[y][x].terrain].terrain[i]}.png`, rotation);
      }
      if (map[y][x].resource) {overlay(x, y, `resources/${map[y][x].resource}.png`, 0, "resource");}
      if (map[y][x].improvements[0])
      {

        overlay(x, y, `improvements/${map[y][x].improvements[0]}.png`, 0, "improvement");
      }
      if (map[y][x].unit) {overlay(x, y, `units/${map[y][x].unit}.png`, 0, "unit");}
      div.onclick = clickTile;
    }
  }
}

// const endTurnButton = document.getElementById("end-turn-button")
// endTurnButton.onclick = endTurn

initMap()
renderMap()

export { map, storedResources }
