import { CONST_OBJ, startGame } from "./game.js";
import { sleep } from "./utility.js"

const socket = io();

socket.on('connect', () => {
  socket.emit('join', {});
});

socket.on('game start', async (data) => {
  await sleep(1000)
  console.log("START")
  CONST_OBJ["IS_TURN"] = data["turn"];
  startGame()
});

export { socket };