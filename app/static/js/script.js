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
      img.style.left = `${x * 112 + y % 2 * 56}px`;
      img.style.top = `${20 +   y * 95}px`;

      img.src = "/static/images/Grassland.png"
      img.style.width = "128px"
      img.style.height = "112px"
      img.style.transform = 'rotate(90deg)';

      const overlay = img.cloneNode()
      overlay.src = "/static/images/Grassland Hill.png"
      overlay.style.transform = '';

      img.onclick = clickTile;
      overlay.onclick = clickTile;

      // img.src = "https://static.wikia.nocookie.net/civilization/images/a/a5/Grassland_%28Civ6%29.png";
      
      
      map.append(img);
      map.append(overlay);
    }
  }
}

init()