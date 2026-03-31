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

  const API_BASE = "http://localhost:5000/api";

  const normalizeMovie = (m) => ({
    id: m.imdbID || m.imdb_id,
    title: m.Title || m.title,
    year: m.Year || m.year,
    genres: (m.Genre || m.genre || "").split(", ").filter(Boolean),
    posterUrl: m.Poster || m.poster,
    plot: m.Plot || m.plot || "No description available.",
    rating: isNaN(parseFloat(m.imdbRating || m.imdb_rating))
      ? 0
      : parseFloat(m.imdbRating || m.imdb_rating)
  });
  
  // Search movies (OMDb)
  const searchMovies = async (query) => {
    if (!query) return [];

    setLoading(true);

    try {
      // Step 1: Search
      const res = await fetch(`${API_BASE}/movies/search?q=${encodeURIComponent(query)}&page=1`);
      const data = await res.json();

      if (!data || data.Response === "False") {
        console.warn("Search failed:", data?.Error);
        return [];
      }

      const searchResults = data.Search || [];

      // Step 2: Get details ONE BY ONE (safe)
      const movies = [];

      for (let i = 0; i < searchResults.length; i++) {
        const m = searchResults[i];

        try {
          const detailRes = await fetch(`${API_BASE}/movies/${m.imdbID}`);
          const detailData = await detailRes.json();

          if (detailData && (detailData.imdbID || detailData.imdb_id)) {
            movies.push(normalizeMovie(detailData));
          }
        } catch (err) {
          console.warn("Skipping bad movie:", m.imdbID);
        }
      }

      return movies;

    } catch (err) {
      console.error("Search crashed:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Get full movie details (and store in Supabase via backend)
  const getMovieDetails = async (imdb_id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/movies/${imdb_id}`);
      const data = await res.json();
      return normalizeMovie(data);
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
      const res = await fetch(`${API_BASE}/ratings?user_id=demo-user`);
      const data = await res.json();
      setUserRatings(data);
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
    }
  };
  const addRating = async (movie_id, rating) => {
    try {
      await fetch(`${API_BASE}/ratings`, {
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
      await fetch(`${API_BASE}/ratings/${existing.id}`, {
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
      await fetch(`${API_BASE}/ratings/${existing.id}`, {
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
      const res = await fetch(`${API_BASE}/recommendations?user_id=demo-user`);
      const data = await res.json();
      setRecommendedMovies(data.map(normalizeMovie));
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
    getMovieDetails
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
