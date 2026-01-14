import { storedResources, map } from "./init.js"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function gainResource(name, amount) {
  storedResources[name] += amount;
  let resource = document.getElementById(name)
  resource.innerHTML = storedResources[name]
}

// returns false if not enough of that resource
function consumeResource(name, amount) {
  if (storedResources[name] < amount) {
    return false;
  }
  storedResources[name] -= amount;
  let resource = document.getElementById(name)
  resource.innerHTML = storedResources[name]
  return true;
}

function addTile(arr, x, y) {
  if (x < 0 || y < 0 || y >= map.length || x >= map[y].length) return;
  console.log("PASSED")
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
  console.log(tiles)
  return tiles
}

function getTileDiv(x, y) {
  const div = document.querySelector(`div[x="${x}"][y="${y}"]`);
  return div
}

export { consumeResource, getAdjacentTiles, getTileDiv, sleep };
