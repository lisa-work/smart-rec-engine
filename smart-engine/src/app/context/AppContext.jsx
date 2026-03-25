import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { moviesDatabase } from "../data/movies";
const AppContext = createContext(void 0);
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const savedUser = localStorage.getItem("movieMindUser");
    const savedRatings = localStorage.getItem("movieMindRatings");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
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
  const addRating = (movieId, rating) => {
    const newRating = {
      movieId,
      rating,
      timestamp: Date.now()
    };
    const updatedRatings = [...userRatings, newRating];
    setUserRatings(updatedRatings);
    localStorage.setItem("movieMindRatings", JSON.stringify(updatedRatings));
  };
  const updateRating = (movieId, rating) => {
    const updatedRatings = userRatings.map(
      (r) => r.movieId === movieId ? { ...r, rating, timestamp: Date.now() } : r
    );
    setUserRatings(updatedRatings);
    localStorage.setItem("movieMindRatings", JSON.stringify(updatedRatings));
  };
  const deleteRating = (movieId) => {
    const updatedRatings = userRatings.filter((r) => r.movieId !== movieId);
    setUserRatings(updatedRatings);
    localStorage.setItem("movieMindRatings", JSON.stringify(updatedRatings));
  };
  const getRatingForMovie = (movieId) => {
    const rating = userRatings.find((r) => r.movieId === movieId);
    return rating ? rating.rating : null;
  };
  const getRecommendedMovies = () => {
    if (userRatings.length === 0) {
      return moviesDatabase.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
    }
    const favoriteGenres = /* @__PURE__ */ new Map();
    const ratedMovieIds = new Set(userRatings.map((r) => r.movieId));
    userRatings.forEach((rating) => {
      if (rating.rating >= 4) {
        const movie = moviesDatabase.find((m) => m.id === rating.movieId);
        if (movie) {
          movie.genres.forEach((genre) => {
            favoriteGenres.set(genre, (favoriteGenres.get(genre) || 0) + rating.rating);
          });
        }
      }
    });
    const recommendations = moviesDatabase.filter((movie) => !ratedMovieIds.has(movie.id)).map((movie) => {
      let score = movie.averageRating;
      movie.genres.forEach((genre) => {
        score += (favoriteGenres.get(genre) || 0) * 0.5;
      });
      return { movie, score };
    }).sort((a, b) => b.score - a.score).slice(0, 5).map((item) => item.movie);
    return recommendations;
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
    getRecommendedMovies,
    searchQuery,
    setSearchQuery
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
