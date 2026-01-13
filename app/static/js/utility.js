import { clickTile } from "./script.js";
import { storedResources } from "./init.js";

async function getJson(file_name) {
  let raw = await fetch(`/static/json/${file_name}`)
  let parsed = await raw.json()
  return parsed;
}

function overlay(x, y, link, rotation=0) {
  const img = document.createElement('img');
  img.style.position = "absolute";

  img.style.width = "128px"
  img.style.height = "112px"

  img.src = `/static/images/${link}`;

  if (rotation != 0) {
    img.style.transform = `rotate(${rotation}deg)`;
  }
  img.onclick = clickTile
  const div = document.querySelector(`div[x="${x}"][y="${y}"]`)
  div.append(img)
}

// returns false if not enough of that resource
function consumeResource(name, amount) {
  if (storedResources[name] < amount) {
    return false;
  }
  storedResources[name] -= amount;
  return true;
}

export { getJson, overlay, consumeResource };