import { CONST_OBJ, startGame } from "./game.js";
import { sleep } from "./utility.js"
import { map } from "./init.js"
import { tintTile } from "./display.js";
import { buildDistrict, buildBuilding } from "./construction.js";

const socket = io();

socket.on('connect', () => {
  socket.emit('join', {});
});

socket.on('game start', async (data) => {
  await sleep(1000)
  CONST_OBJ["IS_TURN"] = data["turn"];
  startGame()
});

socket.on('buy tile', (data) => {
  map[data["y"]][data["x"]].owned = false;
  tintTile(data["x"], data["y"], "red")
})

socket.on('build district', (data) => {
  buildDistrict(data["name"], data["x"], data["y"], true);
})

socket.on('build building', (data) => {
  buildBuilding(data["name"], data["x"], data["y"], true);
})

socket.on('build improvement', (data) => {
  buildImprovement(data["name"], data["x"], data["y"], true)
})

socket.on('end turn', (data) => {
  CONST_OBJ["CURR_TURN"]++;
  document.getElementById("turn").innerHTML = CONST_OBJ["CURR_TURN"]
  CONST_OBJ["IS_TURN"] = true;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].pillaged;
    }
  }
})

socket.on('win game', (data) => {
  CONST_OBJ["IS_TURN"] = false;

})



export { socket };
