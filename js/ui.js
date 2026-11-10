export function renderCards(data) {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = data
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
}
