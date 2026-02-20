const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE = "https://www.omdbapi.com/";

function ensureKey() {
  if (!API_KEY) throw new Error("missing VITE_OMDB_API_KEY in .env");
}

export async function searchMovies(query, page = 1) {
  ensureKey();
  const url = `${BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === "False") {
    return { results: [], totalResults: 0, error: data.Error || "no results" };
  }
  return {
    results: data.Search || [],
    totalResults: Number(data.totalResults || 0),
    error: "",
  };
}

export async function getMovieById(imdbID) {
  ensureKey();
  const url = `${BASE}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error || "movie not found");
  return data;
}
