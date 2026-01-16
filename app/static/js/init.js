import { overlay, removeOverlay, displayResource } from "./display.js"
import { clickTile } from "./script.js"
import { endTurn } from "./game.js"

async function getJson(file_name) {
  let raw = await fetch(`/static/json/${file_name}`)
  let parsed = await raw.json()
  return parsed;
}

const STARTING_MAP = await getJson("map.json")
const TERRAIN_INFO = await getJson("terrain.json")
const RESOURCE_YIELDS = await getJson("resources.json")
const IMPROVEMENTS = await getJson("improvements.json")
const DISTRICTS = await getJson("districts.json")
const TECHNOLOGIES = await getJson("technology.json")
const UNIT_DEFS = await getJson("units.json");

let storedResources = {
  "science": 1000,
  "gold": 1000,
  "food": 1000,
  "production": 1000,
  "population": 1000,
  "iron": 1000,
  "horses": 1000,
  "niter": 1000,
  "coal": 1000
}

// INITIALIZING RESOURCE UI

for (let [key, value] of Object.entries(storedResources)) {
  displayResource(key, value)
}

// INITIALIZING MAP

let map = []

function tileYields(terrain, resource, improvements=[]) {
  const tileYield = {
    "food": 0,
    "production": 0,
    "gold": 0,
    "science": 0,
    "iron": 0,
    "horses": 0,
    "niter": 0,
    "coal": 0
  };

  // Terrain
  if (TERRAIN_INFO[terrain]) {
    tileYield.food = TERRAIN_INFO[terrain].food || 0;
    tileYield.production = TERRAIN_INFO[terrain].production || 0;
    tileYield.gold = TERRAIN_INFO[terrain].gold || 0;
    tileYield.science = TERRAIN_INFO[terrain].science || 0;
  }
  // Resources
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
//   "terrain": "plains",
//   "resource": null,
//   "district": null,
//   "improvements": [],
//   "unit": null,
//   "owned": null,
//   "yield": {
//     "food": 1,
//     "production": 1
//   }
// }

function initMap() {
  for (let y = 0; y < STARTING_MAP.length; y++) {
    map[y] = [];
    for (let x = 0; x < STARTING_MAP[y].length; x++) {
      map[y][x] = {
        terrain: STARTING_MAP[y][x].terrain_type,
        resource: STARTING_MAP[y][x].resource,
        district: null,
        improvements: [],
        unit: null,
        owned: null,
        worked: false,
        yield: tileYields(STARTING_MAP[y][x].terrain_type, STARTING_MAP[y][x].resource)
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
      div.style.left = `${x * 112 + (y + 1) % 2 * 56}px`;
      div.style.top = `${20 +   y * 95}px`;
      div.setAttribute("x", x);
      div.setAttribute("y", y);

      mapDiv.append(div);

      for (var i = 0; i < TERRAIN_INFO[map[y][x].terrain].terrain.length; i++) {
        var base_tile = (i == 0) ? "base_tile" : "overlay_tile";
        var rotation = (i == 0) ? 90 : 0;
        overlay(x, y, `tiles/${TERRAIN_INFO[map[y][x].terrain].terrain[i]}.png`, rotation, base_tile);
      }

      if (map[y][x].resource) {
        overlay(x, y, `resources/${map[y][x].resource}.png`, 0, "resource");
      }

      div.onclick = clickTile;
    }
  }
}

const endTurnButton = document.getElementById("end-turn-button")
endTurnButton.onclick = endTurn

initMap()
renderMap()

export { map, storedResources, TERRAIN_INFO,RESOURCE_YIELDS, IMPROVEMENTS, DISTRICTS, TECHNOLOGIES, UNIT_DEFS, overlay }
