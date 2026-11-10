import { loadData } from "./data.js";

export function renderCards(filtredData, page, totalElement) {
  if (!filtredData) {
    filtredData = loadData();
  }
  if (!page) {
    page = 1;
  }

  if (!totalElement) {
    totalElement = 6;
  }

  let skipElements = (page - 1) * totalElement;
  let takeElements = skipElements + totalElement;

  let printSlice = filtredData.slice(skipElements, takeElements);

  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = printSlice
    .map((elm) => {
      return `
            <div class="bg-[#1e1e24] rounded-xl overflow-hidden shadow-lg flex flex-col">
                <img src="${elm.image}" alt="${elm.title}" class="w-full h-64 object-cover">
                <div class="p-4 flex flex-col flex-grow">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-lg font-bold text-white truncate">${elm.title}</h3>
                        <span class="text-xs bg-[#27272c] px-2 py-1 rounded text-gray-300">${elm.releaseYear}</span>
                    </div>
                    <p class="text-sm text-gray-400 mb-4 line-clamp-2">${elm.description}</p>
                    <div class="mt-auto flex flex-wrap gap-1">
                        ${elm.genres.map((genre) => `<span class="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">${genre}</span>`).join("")}
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

    rederPagination(filtredData, page, totalElement);
}

export function rederPagination(
  modifiedTrips,
  courantPage,
  pageSize,
) {
  const paginationHTML = document.getElementById("pagination");

  let totalElement = modifiedTrips.length;
  paginationHTML.innerHTML = "";

  let totalPages = Math.ceil(totalElement / pageSize);

  if (totalPages <= 1) {
    return;
  }

  // prev button
  if (courantPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "&lt;";
    prevBtn.className =
      "hover:cursor-pointer rounded-[12px] px-4 py-2 bg-[#E7E5E4] text-black font-semibold";
    prevBtn.addEventListener("click", () => {
      renderTrips(modifiedTrips, courantPage - 1, pageSize);
    });
    paginationHTML.appendChild(prevBtn);
  }

  //render all pages
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === courantPage) {
      // Active page visual styling
      btn.className =
        "rounded-[12px] px-4 py-2 bg-[#0C1E4A]/40 text-white font-semibold";
    } else {
      // Inactive page visual styling
      btn.className =
        "hover:cursor-pointer rounded-[12px] px-4 py-2 bg-[#E7E5E4] text-black";
    }

    btn.addEventListener("click", () => {
      renderCards(modifiedTrips, i, pageSize);
    });

    paginationHTML.appendChild(btn);
  }

  // next button
  if (courantPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "&gt;";
    nextBtn.className =
      "hover:cursor-pointer rounded-[12px] px-4 py-2 bg-[#E7E5E4] text-black font-semibold";
    nextBtn.addEventListener("click", () => {
      renderTrips(modifiedTrips, courantPage + 1, pageSize);
    });
    paginationHTML.appendChild(nextBtn);
  }
}