import { startGame } from "./script.js";
import { sleep } from "./utility.js"

const CONST_OBJ = {
  IS_TURN: true,
  CURR_TURN: 1
}

const socket = io();

socket.on('connect', () => {
  socket.emit('join', {});
});

socket.on('game start', async (data) => {
  await sleep(1000)
  console.log("START")
  console.log(data)
  CONST_OBJ["IS_TURN"] = data["turn"];
  startGame()
});

export { socket, CONST_OBJ };