import { getJson, overlay } from "./utility.js";

const STARTING_MAP = await getJson("map.json")
const RESOURCE_YIELDS = await getJson("resources.json")

let map = {}

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