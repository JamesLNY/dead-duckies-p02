import { clickTile } from "./script.js";
import { storedResources, map } from "./init.js";

async function getJson(file_name) {
  let raw = await fetch(`/static/json/${file_name}`)
  let parsed = await raw.json()
  return parsed;
}

function overlay(x, y, link, rotation=0, img_type="terrain") {
  const img = document.createElement('img');
  const img_offsets = {
    terrain: [0,0],
    resource: [4, 4],
    improvement: [92, 4],
    unit: [48, 76]
  };

  if (img_type == "terrain") {
    img.style.width = "128px";
    img.style.height = "112px";
  }
  else {
    img.style.width = "32px";
    img.style.height = "32px";
  }

  img.src = `/static/images/${link}`;
  img.style.position = "absolute";
  img.style.left = img_offsets[img_type][0] + "px";
  img.style.top = img_offsets[img_type][1] + "px";
  if (rotation != 0) {
    img.style.transform = `rotate(${rotation}deg)`;
  }
  img.onclick = clickTile
  const div = document.querySelector(`div[x="${x}"][y="${y}"]`)
  div.append(img)
}

// returns false if not enough of that resource
function consumeResource(name, amount) {
  if (storedResources[name] < amount) {
    return false;
  }
  storedResources[name] -= amount;
  return true;
}

function addTile(arr, x, y) {
  if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) return;
  arr.push(map[y][x])
}

function getAdjacentTiles(x, y) {
  let tiles = []
  if (y % 2 == 1) {
    addTile(tiles, y - 1, x - 1)
    addTile(tiles, y + 1, x - 1)
  } else {
    addTile(tiles, y - 1, x + 1)
    addTile(tiles, y + 1, x + 1)
  }
  addTile(tiles, y - 1, x)
  addTile(tiles, y + 1, x)
  addTile(tiles, y, x - 1)
  addTile(tiles, y, x + 1)
  return tiles
}

export { getJson, overlay, consumeResource, getAdjacentTiles };
