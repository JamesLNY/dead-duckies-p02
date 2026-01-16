//  DeadDuckies
//  Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
//  SoftDev pd4
//  2026-01-16f

import { storedResources, map } from "./init.js"
import { displayResource } from "./display.js";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function gainResource(name, amount) {
  storedResources[name] += amount;
  displayResource(name, storedResources[name])
}

// returns false if not enough of that resource
function consumeResource(name, amount) {
  if (storedResources[name] < amount) {
    return false;
  }
  storedResources[name] -= amount;
  displayResource(name, storedResources[name])
  return true;
}

function addTile(arr, x, y) {     
  if (x < 0 || y < 0 || y >= map.length || x >= map[y].length) return;
  let newObj = structuredClone(map[y][x])
  newObj["x"] = x;
  newObj["y"] = y;
  arr.push(newObj)
}

function getAdjacentTiles(x, y) {
  let tiles = []
  if (y % 2 == 1) {
    addTile(tiles, x - 1, y - 1)
    addTile(tiles, x - 1, y + 1)
  } else {
    addTile(tiles, x + 1, y - 1)
    addTile(tiles, x + 1, y + 1)
  }
  addTile(tiles, x - 1, y)
  addTile(tiles, x + 1, y)
  addTile(tiles, x, y - 1)
  addTile(tiles, x, y + 1)
  return tiles
}

export { consumeResource, getAdjacentTiles, sleep, gainResource };
