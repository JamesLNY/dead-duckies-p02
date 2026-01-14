function overlay(x, y, link, rotation=0, img_type="terrain") {
  const img = document.createElement('img');

  const img_offsets = {
    terrain: [0,0],
    resource: [4, 4],
    improvement: [84, 4], //calculated x using tile width - icon size - 4
    unit: [44, 68] // calculated x using (tile width - icon)/2
  };

  if (img_type == "terrain") {
    img.style.width = "128px";
    img.style.height = "112px";
  }
  else {
    img.style.width = "40px";
    img.style.height = "40px";
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

function getTileDiv(x, y) {
  const div = document.querySelector(`div[x="${x}"][y="${y}"]`);
  return div
}

export { overlay, displayResource, openSidebar, getTileDiv }