import { getJson, overlay } from "./utility.js";

const STARTING_MAP = await getJson("map.json")
const RESOURCE_YIELDS = await getJson("resources.json")

// Temporary map example
let map = [
  [
    {
      "terrain_type": "plains",
      "resource": null,
      "improvements": [],
      "unit": null,
      "yield": {
        "food": 1,
        "production": 1
      }
    },
    {
      "terrain_type": "mountain",
      "resource": "diamonds",
      "improvements": ["mine"],
      "unit": null,
      "yield": {
        "gold": 3,
        "production": 4
      }
    }
  ]
]

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

export { map, storedResources, resourcesPerTurn }