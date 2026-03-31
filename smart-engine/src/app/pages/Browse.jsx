import React from "react";
import { useState, useEffect } from "react";
import { MovieCard } from "../components/MovieCard";
import { GenreFilter } from "../components/GenreFilter";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import { Search } from "lucide-react";

function Browse() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { searchQuery, setSearchQuery, searchMovies, loading } = useApp();
  // The Search Bar
  useEffect(() => {
    let active = true;

    const query = searchQuery.trim();
    if (!query) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      const results = await searchMovies(query);

      if (!active) return; // 🧠 prevents race condition

      if (!results) return;

      const unique = results.filter(
        (m, i, arr) => arr.findIndex(x => x.id === m.id) === i
      );

      let filtered = unique;

      if (selectedGenre !== "All") {
        filtered = unique.filter((movie) =>
          (movie.genres || []).includes(selectedGenre)
        );
      }

      setMovies(filtered);
    };

    fetchMovies();

    return () => {
      active = false;
    };
  }, [searchQuery, selectedGenre]);

  const allGenres = ["All", ...Array.from(new Set(
      movies.flatMap((m) => m.genres || [])
  ))];

  return /* @__PURE__ */ React.createElement(
    "div",{
      className: "min-h-screen",
      style: { backgroundColor: "var(--bg-primary)" }
    }, /* @__PURE__ */ React.createElement(
      "div", { className: "max-w-[1280px] mx-auto px-6 py-12" },
      // Header
      /* @__PURE__ */ React.createElement( motion.div, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "mb-8"
        }, /* @__PURE__ */ React.createElement(
          "h1", {
            className: "mb-2",
            style: {
              fontSize: "var(--text-hero)",
              color: "var(--text-primary)"
            }},
          "Browse Movies"
        ), /* @__PURE__ */ React.createElement(
          "p", {
            style: {
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)"
            }},
          "Discover and rate movies from our collection"
        )),
      // Search
      /* @__PURE__ */ React.createElement(
        motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay: 0.1 },
          className: "mb-8"
        }, /* @__PURE__ */ React.createElement(
          "div", { className: "relative max-w-2xl" },
          /* @__PURE__ */ React.createElement(Search, {
            className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
            style: { color: "var(--text-muted)" }
          }),
          /* @__PURE__ */ React.createElement("input", {
            type: "text",
            placeholder: "Search movies...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className:
              "w-full pl-12 pr-4 py-3 rounded-lg outline-none focus:ring-2 transition-all",
            style: {
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
              fontSize: "var(--text-base)"
            }}))),
      // Genre Filter (temporary static list)
      /* @__PURE__ */ React.createElement(
        motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "mb-12"
        },
        /* @__PURE__ */ React.createElement(GenreFilter, {
          genres: allGenres,
          selectedGenre,
          onSelectGenre: setSelectedGenre
        })),
      // Count / Loading
      /* @__PURE__ */ React.createElement(
        motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay: 0.3 },
          className: "mb-6"
        }, /* @__PURE__ */ React.createElement(
          "p", {
            style: {
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)"
            }},
          loading
            ? "Loading..."
            : movies.length +
                " movie" +
                (movies.length === 1 ? "" : "s") +
                " found"
        )),
      // Movies Grid OR Empty State
      movies.length > 0
        ? /* @__PURE__ */ React.createElement(
            motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.6, delay: 0.4 },
              className:
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center"
            },
            movies.map((movie, index) =>
              /* @__PURE__ */ React.createElement(
                motion.div, {
                  key: movie.id,
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.5)
                  }},
                /* @__PURE__ */ React.createElement(MovieCard, { movie })
              )))
        : !loading &&
          /* @__PURE__ */ React.createElement(
            motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.6, delay: 0.4 },
              className: "text-center py-16"
            }, /* @__PURE__ */ React.createElement(
              "p", {
                className: "mb-2",
                style: {
                  fontSize: "var(--text-card)",
                  color: "var(--text-secondary)"
                }}, "No movies found" ),
            /* @__PURE__ */ React.createElement(
              "p",
              { style: {
                  fontSize: "var(--text-base)",
                  color: "var(--text-muted)"
                }}, "Try a different search"))
));}

export { Browse };