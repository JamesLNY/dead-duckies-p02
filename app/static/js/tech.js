import { getJson } from "./utility.js";

const TECHNOLOGIES = await getJson("technology.json")

var techSidebar = document.getElementById("tech-sidebar");
var infoSidebar = document.getElementById("info-sidebar");
techSidebar.classList.add("closed");
infoSidebar.classList.add("opened");

techSidebar.onclick = () => {
  if (techSidebar.classList.contains("opened")) {
    infoSidebar.classList.add("opened");
    infoSidebar.classList.remove("closed");
    techSidebar.classList.add("closed");
    techSidebar.classList.remove("opened");
  }
  else {
    techSidebar.classList.add("opened");
    techSidebar.classList.remove("closed");
    infoSidebar.classList.add("closed");
    infoSidebar.classList.remove("opened");
  }
}

infoSidebar.onclick = () => {
  if (infoSidebar.classList.contains("opened")) {
    techSidebar.classList.add("opened");
    techSidebar.classList.remove("closed");
    infoSidebar.classList.add("closed");
    infoSidebar.classList.remove("opened");
  }
  else {
    infoSidebar.classList.add("opened");
    infoSidebar.classList.remove("closed");
    techSidebar.classList.add("closed");
    techSidebar.classList.remove("opened");
  }
}

console.log(TECHNOLOGIES)