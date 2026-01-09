document.body.style.zoom = "50%";

const map = document.getElementById("map")

function clickTile(event) {
  console.log(event.target.getAttribute("x") + ", " + event.target.getAttribute("y")) 
}

function init() {
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50 - (y % 2); x++) {
      const img = document.createElement('img');

      img.setAttribute("x", x);
      img.setAttribute("y", y);

      img.style.position = "absolute"
      img.style.left = `${x * 201 + (y % 2 * 100.5)}px`;
      img.style.top = `${y * 174}px`;

      img.src = "https://static.wikia.nocookie.net/civilization/images/a/a5/Grassland_%28Civ6%29.png";
      
      img.onclick = clickTile;
      map.append(img);
    }
  }
}

init()