import { build } from "./construction.js"

function clickTile(event) {
  let x = event.target.parentNode.getAttribute("x")
  let y = event.target.parentNode.getAttribute("y")
}

export { clickTile }