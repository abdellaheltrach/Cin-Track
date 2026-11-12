const key = "favos";

export async function loadData() {
  try {
    let response = await fetch(
      "https://raw.githubusercontent.com/ouchad97/cinetrack-api/main/cinetrack-data.json",
    );

    if (!response.ok) {
      throw new Error("error loading the data");
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch cinetrack data:", error);
  }
}

export function loadFavorites() {
  let stringData = localStorage.getItem(key);

  try{
    if(!stringData)
    {
      localStorage.setItem(key, JSON.stringify([]))
      return [];
    }
    else
    {
      return JSON.parse(stringData);
    }
  } catch (error) {
      
    return [];
     }
  
  
}
export function saveFavorites(newFav) {
  localStorage.setItem(key, JSON.stringify(newFav));
}
