import { storedResources, TECHNOLOGIES, DISTRICTS, IMPROVEMENTS, map } from "./init.js";

var workerButton = document.getElementById("worker-button")
workerButton.disabled = true
let workers = 0

workerButton.onclick = () => {
    let x = workerButton.getAttribute("x")
    let y = workerButton.getAttribute("y")
    if ("remove" in workerButton.classList) {
        removeWorker(x, y)
    }
    else {
        assignWorker(x, y)
    }
}

function updateWorkerButton(x, y) {
    workerButton.disabled = false
    workerButton.hidden = false
    if (map[y][x]["worked"]) {
        workerButton.innerHTML = "Remove Worker"
        workerButton.classList.add("remove")
        workerButton.classList.remove("assign")
    }
    else {
        workerButton.innerHTML = "Assign Worker"
        workerButton.classList.add("assign")
        workerButton.classList.remove("remove")
        workerButton.disabled = (storedResources["population"] <= workers)
    }
    workerButton.setAttribute("x", x)
    workerButton.setAttribute("y", y)
}

function hideWorkerButton() {
    workerButton.hidden = true
}

function assignWorker(x, y) {
    map[y][x]["worked"] = true
    workers++
}

function removeWorker(x, y) {
    map[y][x]["worked"] = false
    workers--
}