import { loadData } from "./data.js";
import { renderCards } from "./ui.js";

let data = await loadData();
// console.log(data)

renderCards(data,1, 6);