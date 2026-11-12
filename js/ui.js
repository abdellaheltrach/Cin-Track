import { loadData, loadFavorites, saveFavorites } from "./data.js";

//action
let showsData = await loadData();

window.closeModel = function () {
  const model = document.getElementById("modal");
  model.classList.add("hidden");
};

window.openModel = function (card) {
  const id = card.dataset.id;

  const item = showsData.find((d) => d.id === id);
  if (!item) return;

  // Populate the modal with the image on the left and full info on the right
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
          <button
          id="closeModalBtn"
          class="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-[#35353d] p-1.5 rounded-full transition-colors cursor-pointer"
          onclick="closeModel()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
    <div class="flex flex-col md:flex-row gap-6 items-start">
      <!-- Left: Image -->
      <img src="${item.image}" alt="${item.title}" class="w-48 h-auto rounded-lg shadow-md object-cover flex-shrink-0">
      
      <!-- Right: All Info -->
      <div class="flex-1 text-white">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold">${item.title} (${item.releaseYear})</h2>
          <span class="bg-gray-700 text-xs px-2 py-1 rounded uppercase tracking-wider text-gray-300">${item.type}</span>
        </div>
        
        <p class="text-gray-300 mt-2 mb-4">${item.description}</p>
        
        <div class="space-y-1 text-sm text-gray-400">
          <p><strong class="text-gray-200">Genres:</strong> ${item.genres.join(", ")}</p>
          <p><strong class="text-gray-200">Directors:</strong> ${item.directors.join(", ")}</p>
          ${item.duration ? `<p><strong class="text-gray-200">Duration:</strong> ${item.duration} mins</p>` : ""}
          ${item.seasons ? `<p><strong class="text-gray-200">Seasons:</strong> ${item.seasons.length}</p>` : ""}
          <p><strong class="text-gray-200">Countries:</strong> ${item.productionCountries.join(", ")}</p>
        </div>
      </div>
    </div>
  `;

  // Show the modal
  const model = document.getElementById("modal");
  model.classList.remove("hidden");
};

export function renderCards(filtredData, page, size) {
  if (!filtredData) {
    filtredData = loadData();
  }
  if (!page) {
    page = 1;
  }

  if (!size) {
    size = 6;
  }

  let skipElements = (page - 1) * size;
  let takeElements = skipElements + size;

  let printSlice = filtredData.slice(skipElements, takeElements);

  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = printSlice
    .map((elm) => {
      return `
          <div>
            <div data-id='${elm.id}' class="relative bg-[#1e1e24] rounded overflow-hidden shadow-lg flex flex-col hover:cursor-pointer transition-all duration-300 hover:-translate-y-2"
            onclick='openModel(this)'>
             <div onclick="event.stopPropagation()">
            <button data-id='${elm.id}' class="hover:cursor-pointer hover:bg-red" onclick="handleFavs(this)">
              <svg class="absolute top-3 right-3 transition-transform duration-200 hover:scale-130 " xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart preview-icon"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
            </button>
             </div>
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
            </div>
        `;
    })
    .join("");

  rederPagination(filtredData, page, size);
}

export function rederPagination(showsTable, courantPage, pageSize) {
  const paginationHTML = document.getElementById("pagination");

  let totalElement = showsTable.length;
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
      renderCards(showsTable, courantPage - 1, pageSize);
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
      renderCards(showsTable, i, pageSize);
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
      renderCards(showsTable, courantPage + 1, pageSize);
    });
    paginationHTML.appendChild(nextBtn);
  }
}

export async function handleFilter() {
  let shows = await loadData();

  const serchInput = document.getElementById("search");
  const statusSelector = document.getElementById("filter");

  const searchString = serchInput.value.toLocaleLowerCase().trim();
  const status = statusSelector.value;

  const filtredShows = shows.filter((show) => {
    const matchInput = show.title.toLocaleLowerCase().includes(searchString);

    let matchFilter = false;

    if (status === "Tout") {
      matchFilter = true;
    } else if (status === "Films") {
      matchFilter = show.type === "movie";
    } else if (status === "Series") {
      matchFilter = show.type === "series";
    }

    return matchInput && matchFilter;
  });

  renderCards(filtredShows, 1, 6);
}

document.handleFavs = function (element) {
  //load faves
  let favorites = loadFavorites();
  console.log(favorites
  )

  const showId = Number(element.dataset.id);
  const selectedShow = showsData.find((s) => Number(s.id) === showId);

  //check if the id is in faves or not if in we romve it if not then add it
  let foundIndex = favorites.findIndex((f) => Number(f.id) === showId);
  if (foundIndex !== -1) {
    favorites.splice(foundIndex,1);
  } else {

    if (selectedShow) {
      favorites.push(selectedShow);
    }
  }
  saveFavorites(favorites);
};


// [].findIndex
