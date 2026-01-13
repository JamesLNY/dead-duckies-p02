import { getJson } from "./utility.js";
const socket = io();

const TECHNOLOGIES = await getJson("technology.json")
const researched = []
const available = ["pottery", "husbandry", "mining", "sailing"]

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

function completeTech(tech) {
    available.splice(available.indexOf(tech), 1)
    researched.push(tech)
    for (dependant in TECHNOLOGIES[tech]["tech_unlocks"]) {
        if (TECHNOLOGIES[dependant]["tech_unlocks"].every(prereq => researched.includes(prereq))) { // adds each tech unlock only if each has had all prereqs researched
            available.push(dependant)
        }
    }
    socket.emit("tech_finished", {"technology_name": tech})
}

function isResearched(tech) {
    return researched.includes(tech)
}
console.log(TECHNOLOGIES)