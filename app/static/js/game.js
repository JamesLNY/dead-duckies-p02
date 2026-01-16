//  DeadDuckies
//  Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
//  SoftDev pd4
//  2026-01-16f

import { buildDistrict, gainedTile, ownedTiles } from "./construction.js"
import { getAdjacentTiles, consumeResource, gainResource } from "./utility.js";
import { storedResources, map } from "./init.js";
import { socket } from "./socket.js";
import { createUnit, myUnits, removeSelected } from "./units.js";
import { closeSidebar } from "./display.js";

let foodPopConstant = 20
const CONST_OBJ = {
  IS_TURN: true,
  CURR_TURN: 1
}

async function startGame() {
  let adjacent
  if (CONST_OBJ["IS_TURN"]) {
    document.getElementById('is-turn').innerHTML = `Your Turn`
    buildDistrict("city center", 2, 1)
    createUnit("ranged", "archer", 20, 0, "player");
    gainedTile(2, 1)
    adjacent = getAdjacentTiles(2, 1)
  } else {
    document.getElementById('is-turn').innerHTML = `Enemy Turn`
    buildDistrict("city center", 21, 1)
    createUnit("ranged", "archer", 20, 1, "player");
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
      if (tile["worked"] || tile["district"]) gainResource(key, value)
    }
  });

  myUnits.forEach((unit) => {
    unit.movement = unit.maxMovement
  })

  document.getElementById('is-turn').innerHTML = `Enemy Turn`
  
  gainResource("population", Math.floor(storedResources["food"] / foodPopConstant))
  consumeResource("food", storedResources["food"] - (storedResources["food"] % foodPopConstant))
  closeSidebar()
  removeSelected()
  CONST_OBJ["IS_TURN"] = false;
  socket.emit("end turn", storedResources)

  if (storedResources["gold"] == 1100) {
    socket.emit("win game", {})
    window.location.href = "/win_game?won=1";
  }
}

export { CONST_OBJ, endTurn, startGame }
