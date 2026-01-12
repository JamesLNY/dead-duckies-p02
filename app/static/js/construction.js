import { getJson } from "./utility.js"

const IMPROVEMENTS = await getJson("improvements.json")
const DISTRICTS = await getJson("districts.json")

function build() {

}

export { build }