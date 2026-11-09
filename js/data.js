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
