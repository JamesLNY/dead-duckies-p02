import { storedResources, map } from "./init.js"

function clickTile(event) {
  let x = event.target.parentNode.getAttribute("x")
  let y = event.target.parentNode.getAttribute("y")
}

function endTurn() {
  
}

export { clickTile, endTurn }