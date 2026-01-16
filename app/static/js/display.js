function overlay(x, y, link, rotation=0, img_type="base_tile") {
  const img = document.createElement('img');

  const img_offsets = {
    base_tile: [0,0],
    overlay_tile: [8,0],
    resource: [44, 68],
    unit: [44, 28]
  };

  if (img_type == "base_tile") {
    img.style.width = "128px";
    img.style.height = "112px";
  }
  else {
    if (img_type == "overlay_tile") {
      img.style.width = "112px";
      img.style.height = "96px";
    }
    else
    {
      img.style.width = "40px";
      img.style.height = "40px";
    }
  }

  img.src = `/static/images/${link}`;
  img.style.position = "absolute";
  img.style.left = img_offsets[img_type][0] + "px";
  img.style.top = img_offsets[img_type][1] + "px";
  if (rotation != 0) {
    img.style.transform = `rotate(${rotation}deg)`;
  }

  const div = document.querySelector(`div[x="${x}"][y="${y}"]`)
  div.append(img)
}

function removeOverlay(x, y, img_type) {
  const div = document.querySelector(`div[x="${x}"][y="${y}"]`);
  if (div) {
    const img = div.querySelector(`img[src*="${img_type}/"]`);
    if (img) {img.remove();}
  }
}
// Specifically for resource bar
function displayResource(name, amount) {
  let resource = document.getElementById(name)
  resource.innerHTML = amount
}

function openSidebar(name) {
  const sidebars = document.querySelectorAll(".sidebar");
  sidebars.forEach((ele) => {
    ele.classList.remove("open")
    ele.classList.add("closed")
  })
  const toOpen = document.getElementById(`${name}-sidebar`);
  toOpen.classList.remove("closed")
  toOpen.classList.add("open")
}

function closeSidebar() {
  const sidebars = document.querySelectorAll(".sidebar");
  sidebars.forEach((ele) => {
    ele.classList.remove("open")
    ele.classList.add("closed")
  })
}

function displayTurn(turnNum, isTurn) {

}

function getTileDiv(x, y) {
  const div = document.querySelector(`div[x="${x}"][y="${y}"]`);
  return div
}

function tintTile(x, y, color) {
  const tileDiv = getTileDiv(x, y);
  tileDiv.firstElementChild.classList.add(`tint-${color}`);
}

export { overlay, removeOverlay, displayResource, openSidebar, getTileDiv, tintTile, closeSidebar }
