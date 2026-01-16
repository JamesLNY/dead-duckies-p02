//  DeadDuckies
//  Roster: James Lei, Kiran Soemardjo, Sarah Zou, Emaan Asif
//  SoftDev pd4
//  2026-01-16f

import { map } from "./init.js";
import { consumeResource, gainResource } from "./utility.js"
import { closeSidebar } from "./display.js"
// var workerButton = document.getElementById("worker-button")
// workerButton.disabled = true

// workerButton.onclick = () => {
//     let x = workerButton.getAttribute("x")
//     let y = workerButton.getAttribute("y")
//     if ("remove" in workerButton.classList) {
//         removeWorker(x, y)
//     }
//     else {
//         assignWorker(x, y)
//     }
// }

// function updateWorkerButton(x, y) {
//     workerButton.disabled = false
//     workerButton.hidden = false
//     if (map[y][x]["worked"]) {
//         workerButton.innerHTML = "Remove Worker"
//         workerButton.classList.add("remove")
//         workerButton.classList.remove("assign")
//     }
//     else {
//         workerButton.innerHTML = "Assign Worker"
//         workerButton.classList.add("assign")
//         workerButton.classList.remove("remove")
//         workerButton.disabled = (storedResources["population"] <= workers)
//     }
//     workerButton.setAttribute("x", x)
//     workerButton.setAttribute("y", y)
// }

// function hideWorkerButton() {
//     workerButton.hidden = true
// }

function assignWorker(x, y) {
    closeSidebar()
    map[y][x]["worked"] = true
    consumeResource("population", 1)
}

function removeWorker(x, y) {
    closeSidebar()
    map[y][x]["worked"] = false
    gainResource("population", 1)
}

export {assignWorker, removeWorker};
