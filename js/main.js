import { loadData } from "./data.js";

let data = await loadData();
console.log(data)

console.log(document.getElementById("search"));