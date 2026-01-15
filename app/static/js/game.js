import { buildDistrict, gainedTile, ownedTiles } from "./construction.js"
import { getAdjacentTiles, gainResource } from "./utility.js";
import { storedResources, map } from "./init.js";
import { socket } from "./socket.js";

const CONST_OBJ = {
  IS_TURN: true,
  CURR_TURN: 1
}

async function startGame() {
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
  for (let i in adjacent) {
    gainedTile(adjacent[i]["x"], adjacent[i]["y"])
  }
}

function endTurn() {
  if (!CONST_OBJ["IS_TURN"]) return;

  ownedTiles.forEach((element) => {
    let tile = map[element["y"]][element["x"]]
    for (let [key, value] of Object.entries(tile["yield"])) {
      gainResource(key, value)
    }
  });

  CONST_OBJ["IS_TURN"] = false;
  socket.emit("end turn", storedResources)
}

export { CONST_OBJ, endTurn, startGame }