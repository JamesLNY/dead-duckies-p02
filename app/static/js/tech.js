import { getJson } from "./utility.js";

const TECHNOLOGIES = await getJson("technology.json")

var techSidebar = document.getElementById("tech-sidebar");
var infoSidebar = document.getElementById("info-sidebar");
techSidebar.classList.add("closed");
infoSidebar.classList.add("opened");

techSidebar.onclick = () => {
  techSidebar.classList.add("opened");
  techSidebar.classList.remove("closed");
  infoSidebar.classList.add("closed");
  infoSidebar.classList.remove("opened");
}

infoSidebar.onclick = () => {
  infoSidebar.classList.add("opened");
  infoSidebar.classList.remove("closed");
  techSidebar.classList.add("closed");
  techSidebar.classList.remove("opened");
}

console.log(TECHNOLOGIES)