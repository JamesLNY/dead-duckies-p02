const map = document.getElementById("map")

function clickTile(event) {
  let x = event.target.parentNode.getAttribute("x")
  let y = event.target.parentNode.getAttribute("y")
}

function overlay(x, y, link, rotation=0) {
  const img = document.createElement('img');
  img.style.position = "absolute";
  img.style.left = 0;
  img.style.top = 0;
  img.src = `/static/images/${link}`;
  img.style.width = "128px"
  img.style.height = "112px"
  if (rotation != 0) {
    img.style.transform = `rotate(${rotation}deg)`;
  }
  img.onclick = clickTile
  const div = document.querySelector(`div[x="${x}"][y="${y}"]`)
  div.append(img)
}

function init() {
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50 - (y % 2); x++) {
      const div = document.createElement('div');
      div.style.position = "absolute"
      div.style.left = `${x * 112 + y % 2 * 56}px`;
      div.style.top = `${20 +   y * 95}px`;
      div.setAttribute("x", x);
      div.setAttribute("y", y);
      
      map.append(div);

      overlay(x, y, "Grassland.png", 90)
      overlay(x, y, "Grassland Hill.png", 0)
    }
  }
}

init()