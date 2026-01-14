import { consumeResource } from "./utility.js";
import { storedResources, TECHNOLOGIES } from "./init.js";
import { openSidebar } from "./display.js";
import { socket } from "./socket.js"

const researched = []
const available = ["pottery", "husbandry", "mining", "sailing"]

var techList = document.getElementById("tech-list");

var techSidebar = document.getElementById("tech-sidebar");

techSidebar.onclick = () => {
  openSidebar("tech")
  updateTech()
}

function updateTech() {
  while (techList.hasChildNodes()) {
    techList.removeChild(techList.firstChild)
  }

  available.forEach((tech) => {
    let listItem = document.createElement("button")
    if (storedResources["science"] < TECHNOLOGIES[tech]["cost"]) {
        listItem.disabled = true
    }
    listItem.classList.add("technology")
    listItem.style.display = "flex"
    listItem.style.flexDirection = "column"
    let HTMLString=`<div class="tech-button-content">${capitalize(tech)} <div style="display: flex; align-items: center; gap: 5px;">${TECHNOLOGIES[tech]["cost"]} <img style="width: 20px; height: 20px;" src="/static/images/icons/science.png" alt="Science"></div></div> <hr style="width: 100%">`
    TECHNOLOGIES[tech]["unlocks"].forEach(unlock => HTMLString += `<div>${capitalize(unlock)}</div>`)
    // console.log(HTMLString)
    listItem.innerHTML = HTMLString
    listItem.setAttribute("name", tech)
    listItem.addEventListener("click", (event) => {
        completeTech(tech)
        updateTech()
    })
    techList.appendChild(listItem)
    techList.appendChild(document.createElement("br"))
  })
}

function completeTech(tech) {
    available.splice(available.indexOf(tech), 1)
    researched.push(tech)
    consumeResource("science", TECHNOLOGIES[tech]["cost"])
    TECHNOLOGIES[tech]["tech_unlocks"].forEach((dependant) => {
        if (TECHNOLOGIES[dependant]["prerequisites"].every(prereq => researched.includes(prereq))) { // adds each tech unlock only if each has had all prereqs researched
            available.push(dependant)
        }
    })
    socket.emit("finish tech", {"technology_name": tech})
}

function isResearched(tech) {
    return researched.includes(tech)
}

function capitalize(string) {
    let wordArray = []
    string.split(" ").forEach(word => {
        wordArray.push(word.substring(0, 1).toUpperCase() + word.substring(1))
    })
    return wordArray.join(" ")
}

export { isResearched }
