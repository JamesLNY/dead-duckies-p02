import { buildDistrict, gainedTile } from "./construction.js"
import { getAdjacentTiles } from "./utility.js";

const CONST_OBJ = {
  IS_TURN: true,
  CURR_TURN: 1
}

function startGame() {
  let adjacent
  if (CONST_OBJ["IS_TURN"]) {
    buildDistrict("city center", 2, 1)
    gainedTile(2, 1)
    adjacent = getAdjacentTiles(2, 1)
  } else {
    buildDistrict("city center", 21, 1)
    gainedTile(21, 1)
    adjacent = getAdjacentTiles(21, 1)
  }
  adjacent.forEach((tile) => {
    gainedTile(tile["x"], tile["y"])
  })
}

function endTurn() {
  if (!CONST_OBJ["IS_TURN"]) return;
  map.forEach((row) => {
    row.forEach((tile) => {

    })
  })
}

export { CONST_OBJ, endTurn, startGame }