import { getJson } from "./utility.js";
const socket = io();

const TECHNOLOGIES = await getJson("technology.json")
const researched = []
const available = ["pottery", "husbandry", "mining", "sailing"]

var techSidebar = document.getElementById("tech-sidebar");
var infoSidebar = document.getElementById("info-sidebar");
techSidebar.classList.add("closed");
infoSidebar.classList.add("opened");
var techList = document.getElementById("tech-list");

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
  updateTech()  
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

function clickTech(event) {
  let tech = event.target.getAttribute("name")
  completeTech(tech)
  updateTech()
  console.log("a")
}

function updateTech() {
  while (techList.hasChildNodes()) {
    techList.removeChild(techList.firstChild)
  }

  available.forEach((tech) => {
    let listItem = document.createElement("li")
    listItem.innerHTML = tech
    listItem.setAttribute("name", tech)
    listItem.onclick = clickTech
    techList.appendChild(listItem)
  })
}

function completeTech(tech) {
    available.splice(available.indexOf(tech), 1)
    researched.push(tech)
    TECHNOLOGIES[tech]["tech_unlocks"].forEach((dependant) => {
        if (TECHNOLOGIES[dependant]["tech_unlocks"].every(prereq => researched.includes(prereq))) { // adds each tech unlock only if each has had all prereqs researched
            available.push(dependant)
        }
    })
    console.log(available)
    socket.emit("tech_finished", {"technology_name": tech})
}

function isResearched(tech) {
    return researched.includes(tech)
}
console.log(TECHNOLOGIES)
