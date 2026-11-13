import { loadData } from "./data.js";
import { handleFilter, renderCards } from "./ui.js";


let data = await loadData();

// console.log(data);

renderCards(data, 1, 6);

const serchInput = document.getElementById("search");
const statusSelector = document.getElementById("filter");


serchInput.addEventListener('input',handleFilter)
statusSelector.addEventListener("change", handleFilter);
