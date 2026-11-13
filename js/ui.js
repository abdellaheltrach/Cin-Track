import { loadData, loadFavorites, saveFavorites } from "./data.js";

//action
let showsData = await loadData();

let currentPage = 1;
let currentSize = 6;

window.closeModel = function () {
  const model = document.getElementById("modal");
  model.classList.add("hidden");
};

export function openModel(card) {
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
}

export function renderCards(filtredData, page, size) {
  if (!filtredData) {
    if (!showsData) {
      return;
    }
    filtredData = showsData;

  }
  if (!page) {
    page = 1;
  }

  if (!size) {
    size = 6;
  }

  currentPage = page;
  currentSize = size;

  let skipElements = (page - 1) * size;
  let takeElements = skipElements + size;

  let printSlice = filtredData.slice(skipElements, takeElements);

  const cardsContainer = document.getElementById("cardsContainer");

  //faves handles

  let favorites = loadFavorites();

  cardsContainer.innerHTML = printSlice
    .map((elm) => {
      return `
            <div data-id='${elm.id}' class="card relative bg-[#1e1e24] rounded overflow-hidden shadow-lg flex flex-col hover:cursor-pointer transition-all duration-300 hover:-translate-y-2">
            <button data-id='${elm.id}' class="hover:cursor-pointer hover:bg-red" onclick="handleFavs(this); event.stopPropagation()">
              <svg class="absolute top-3 right-3 transition-transform duration-200 hover:scale-125 lucide lucide-heart preview-icon ${favorites.some((f) => Number(f.id) === Number(elm.id)) ? "text-red-500 fill-red-500" : ""}" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
              </svg>            
            </button>

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

  // This will now correctly attach the click listener and read the dataset id
  cardsContainer.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      openModel(card);
    });
  });

  rederPagination(filtredData, page, size);
  renderFavorites();
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

  renderCards(filtredShows, 1, currentSize);
}

document.handleFavs = function (element) {
  //load faves
  let favorites = loadFavorites();

  const showId = Number(element.dataset.id);
  const selectedShow = showsData.find((s) => Number(s.id) === showId);

  //check if the id is in faves or not if in we romve it if not then add it
  let foundIndex = favorites.findIndex((f) => Number(f.id) === showId);
  if (foundIndex !== -1) {
    favorites.splice(foundIndex, 1);
  } else {
    if (selectedShow) {
      favorites.push(selectedShow);
    }
  }
  saveFavorites(favorites);
  renderCards(showsData, currentPage, currentSize);
  renderFavorites();
};
export function renderFavorites() {
  const container = document.getElementById("favorite-container");
  if (!container) return;

  const favorites = loadFavorites();

  const stats = favorites.reduce(
    (obj, fav) => {
      if (fav.type === "movie") {
        obj.movies++;
      } else if (fav.type === "series") {
        obj.series++;
      }
      return obj;
    },
    { movies: 0, series: 0 }
  );

  // Si aucun favori, afficher un message vide
  if (favorites.length === 0) {
    container.className = "flex flex-col h-[100vh] items-center justify-center";
    container.innerHTML = `<p class="text-gray-400 text-sm">No favorite shows added yet.</p>`;
    return;
  } else {
    container.className = "flex flex-col gap-3 p-3";
  }

  // Création du petit compteur statistique (généré grâce à reduce)
  let headerStatsHTML = `
    <div class="bg-[#1e1e24] rounded-xl overflow-hidden shadow-md flex items-center gap-3 p-2.5 transition-all hover:bg-[#27272c]">
    <span>Total: <strong class="text-white">${favorites.length}</strong></span>
      <span>Films: <strong class="text-white">${stats.movies}</strong></span>
      <span>Séries: <strong class="text-white">${stats.series}</strong></span>
    </div>
  `;

  // Génération de la liste des favoris avec map
  const listHTML = favorites
    .map(
      (elm) => `
    <div class="relative bg-[#1e1e24] rounded-xl overflow-hidden shadow-md flex items-center gap-3 p-2.5 transition-all hover:bg-[#27272c]">
      <img src="${elm.image}" alt="${elm.title}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0">

      <div class="flex flex-col flex-grow min-w-0">
          <div class="flex items-center justify-between gap-2 mb-1">
              <h3 class="text-sm font-bold text-white truncate">${elm.title}</h3>
              <span class="text-[10px] bg-[#35353d] px-1.5 py-0.5 rounded text-gray-300 flex-shrink-0">${elm.releaseYear}</span>
          </div>
          <p class="text-xs text-gray-400 line-clamp-1">${elm.description}</p>
      </div>

      <button data-id="${elm.id}" class="remove-fav-btn text-gray-400 hover:text-white hover:bg-red-600/80 p-1.5 rounded-full transition-colors cursor-pointer flex-shrink-0" title="Remove">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  `,
    )
    .join("");

  // Injection du compteur + de la liste
  container.innerHTML = headerStatsHTML + listHTML;

  // Gestion des clics pour supprimer un favori
  container.querySelectorAll(".remove-fav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const showId = Number(btn.dataset.id);

      let updatedFavorites = loadFavorites().filter(
        (f) => Number(f.id) !== showId,
      );
      saveFavorites(updatedFavorites);

      renderFavorites();
      if (typeof renderCards === "function") {
        renderCards();
      }
    });
  });
}
export function handleFetchError() {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
        <svg class="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Impossible de charger les données</h3>
        <p class="text-gray-400 max-w-md mb-6">Une erreur est survenue lors de la récupération des films. Vérifiez votre connexion Internet et réessayez.</p>
        <button onclick="window.location.reload()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer">
          Réessayer
        </button>
      </div>
    `;
  const paginationHTML = document.getElementById("pagination");
  paginationHTML.innerHTML="";
}
