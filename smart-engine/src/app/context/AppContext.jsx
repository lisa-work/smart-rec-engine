import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
/*import { moviesDatabase } from "../data/movies";*/
const AppContext = createContext(void 0);
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeMovie = (m) => {
    const normalized = {
      id: m.imdbID || m.imdb_id,
      title: m.Title || m.title,
      year: m.Year || m.year,
      genres: (m.Genre || m.genre || "").split(", ").filter(Boolean),
      posterUrl: m.Poster || m.poster,
      plot: m.Plot || m.plot || "No description available.",
      rating: isNaN(parseFloat(m.imdbRating || m.imdb_rating))
        ? 0 : parseFloat(m.imdbRating || m.imdb_rating)
    };
    if (!normalized.id) {
      console.warn("Movie missing ID, raw data:", m);
    }
    return normalized;
  };
  
  // Search movies (OMDb)
  const searchMovies = async (query) => {
    if (!query) return [];

    try {
      const pages = [1, 2, 3];
      // Step 1: fetch search pages safely
      const results = await Promise.all(
        pages.map(async (page) => {
          try {
            const res = await fetch(
              `/api/movies/search?q=${query}&page=${page}`);
            if (!res.ok) {
              console.warn(`Search page ${page} failed with status ${res.status}`);
              return [];
            }
            const data = await res.json();
            console.log(`PAGE ${page} RESPONSE:`, data);

            if (data.success === false) return [];

            return data.data.Search || [];
          } catch (err) {
            console.warn(`Error fetching page ${page}:`, err);
            return [];
          }}));
      const combined = results.flat();
      if (combined.length === 0) {
        console.warn("No search results from API");
        return [];
      }

      // Step 2: fetch full details safely
      const detailed = await Promise.all(
        combined.map(async (m) => {
          try {
            const res = await fetch(`/api/movies/${m.imdbID}`);
            if (!res.ok) {
              console.warn(`Detail fetch failed for ${m.imdbID}, using search data`);
              return normalizeMovie(m);  // Fallback to search result
            }
            const full = await res.json();
            console.log(`DETAIL API RESPONSE for ${m.imdbID}:`, JSON.stringify(full, null, 2));
            
            // Try to extract the movie data - it could be wrapped in various ways
            let rawMovie = full;
            if (full?.data && typeof full.data === 'object') {
              // If wrapped in {data: {...}}, unwrap it
              rawMovie = full.data;
            }
            
            console.log(`Using rawMovie:`, rawMovie);
            const normalized = normalizeMovie(rawMovie);
            console.log(`NORMALIZED from detail:`, normalized);
            return normalized;
          } catch (err) {
            console.warn("Detail fetch error:", err);
            return normalizeMovie(m);  // Fallback to search result
          }}));

      // Step 3: filter valid movies ONLY (exclude 0 ratings)
      const cleaned = detailed.filter((m) => m && m.id && m.rating > 0);
      console.log("FINAL CLEANED RESULTS:", cleaned);
      return cleaned;

    } catch (err) {
      console.error("Search failed:", err);
      return [];
    }
  };

  // Get full movie details (and store in Supabase via backend)
  const getMovieDetails = async (imdb_id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies/${imdb_id}`);
      const response = await res.json();
      const movieData = response.data || response;
      return normalizeMovie(movieData);
    } catch (err) {
      console.error("Fetch movie failed:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("movieMindUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchRatings();
  }, []);
  const login = (username, password) => {
    const newUser = {
      username,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=FF4C4C&color=fff`
    };
    setUser(newUser);
    localStorage.setItem("movieMindUser", JSON.stringify(newUser));
  };
  const logout = () => {
    setUser(null);
    setUserRatings([]);
    localStorage.removeItem("movieMindUser");
    localStorage.removeItem("movieMindRatings");
  };
  const fetchRatings = async () => {
    try {
      const res = await fetch(`/api/ratings?user_id=demo-user`);
      const response = await res.json();
      const ratingsData = response.data || response;
      setUserRatings(Array.isArray(ratingsData) ? ratingsData : []);
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
    }
  };
  const addRating = async (movie_id, rating) => {
    try {
      await fetch(`/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          movie_id,
          rating,
          user_id: "demo-user"
        })
      });
      await fetchRatings();
      await fetchRecommendations();
    } catch (err) {
      console.error("Add rating failed:", err);
    }
  };
  const updateRating = async (movie_id, rating) => {
    const existing = userRatings.find(r => r.movie_id === movie_id);
    if (!existing) { console.warn("No existing rating found for movie:", movie_id);
      return;
    }
    try {
      await fetch(`/api/ratings/${existing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rating })
      });
      await fetchRatings();
      await fetchRecommendations();
    } catch (err) {
      console.error("Update rating failed:", err);
    }
  };
  const deleteRating = async (movie_id) => {
    const existing = userRatings.find(r => r.movie_id === movie_id);
    if (!existing) { console.warn("No existing rating found for movie:", movie_id);
      return;
    }
    try {
      await fetch(`/api/ratings/${existing.id}`, {
        method: "DELETE"
      });

      await fetchRatings();
      await fetchRecommendations();
    } catch (err) {
      console.error("Delete rating failed:", err);
    }
  };
  const getRatingForMovie = (movie_id) => {
    const rating = userRatings.find((r) => r.movie_id === movie_id);
    return rating ? rating.rating : null;
  };
  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`/api/recommendations?user_id=demo-user`);
      const response = await res.json();
      const moviesData = response.data || response;
      setRecommendedMovies(Array.isArray(moviesData) ? moviesData.map(normalizeMovie) : []);
    } catch (err) {
      console.error(err);
    }
  };
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    userRatings,
    addRating,
    updateRating,
    deleteRating,
    getRatingForMovie,
    recommendedMovies,
    fetchRecommendations,
    searchQuery,
    setSearchQuery,
    searchMovies,
    getMovieDetails,
    loading
  };
  return /* @__PURE__ */ React.createElement(AppContext.Provider, { value }, children);
}
function useApp() {
  const context = useContext(AppContext);
  if (context === void 0) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
export {
  AppProvider,
  useApp
};
