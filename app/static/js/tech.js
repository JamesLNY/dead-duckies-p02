async function getJson(file_name) {
  let raw = await fetch(`/static/json/${file_name}`)
  let parsed = await raw.json()
  return parsed;
}

const technologies = await getJson("technology.json")

console.log(technologies)