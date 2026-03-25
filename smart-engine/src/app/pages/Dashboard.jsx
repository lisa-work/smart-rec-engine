import React from "react";
import { useApp } from "../context/AppContext";
import { MovieCard } from "../components/MovieCard";
import { moviesDatabase } from "../data/movies";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
function Dashboard() {
  const { getRecommendedMovies, userRatings } = useApp();
  const recommendedMovies = getRecommendedMovies();
  const recentlyRated = userRatings.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10).map((rating) => moviesDatabase.find((m) => m.id === rating.movieId)).filter(Boolean);
  const [recentScrollPos, setRecentScrollPos] = useState(0);
  const scrollRecent = (direction) => {
    const container = document.getElementById("recent-carousel");
    if (container) {
      const scrollAmount = 280;
      const newPos = direction === "left" ? Math.max(0, recentScrollPos - scrollAmount) : Math.min(container.scrollWidth - container.clientWidth, recentScrollPos + scrollAmount);
      container.scrollTo({ left: newPos, behavior: "smooth" });
      setRecentScrollPos(newPos);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 py-12" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "mb-12"
    },
    /* @__PURE__ */ React.createElement(
      "h1",
      {
        className: "mb-2",
        style: {
          fontSize: "var(--text-hero)",
          color: "var(--text-primary)"
        }
      },
      "Your Personalized Recommendations"
    ),
    /* @__PURE__ */ React.createElement("p", { style: {
      fontSize: "var(--text-base)",
      color: "var(--text-secondary)"
    } }, userRatings.length > 0 ? `Based on your ${userRatings.length} rating${userRatings.length === 1 ? "" : "s"}` : "Start rating movies to get personalized recommendations")
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.2 },
      className: "mb-16"
    },
    /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center" }, recommendedMovies.map((movie, index) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: movie.id,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: index * 0.1 }
      },
      /* @__PURE__ */ React.createElement(MovieCard, { movie, isRecommended: userRatings.length > 0 })
    )))
  ), recentlyRated.length > 0 && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.4 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement(
      "h2",
      {
        style: {
          fontSize: "var(--text-section)",
          color: "var(--text-primary)"
        }
      },
      "Recently Rated Movies"
    ), recentlyRated.length > 4 && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => scrollRecent("left"),
        disabled: recentScrollPos === 0,
        className: "p-2 rounded-lg transition-all disabled:opacity-30",
        style: { backgroundColor: "var(--bg-card)" }
      },
      /* @__PURE__ */ React.createElement(ChevronLeft, { className: "w-5 h-5", style: { color: "var(--text-primary)" } })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => scrollRecent("right"),
        className: "p-2 rounded-lg transition-all",
        style: { backgroundColor: "var(--bg-card)" }
      },
      /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-5 h-5", style: { color: "var(--text-primary)" } })
    ))),
    /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        id: "recent-carousel",
        className: "flex gap-6 overflow-x-auto pb-4 scrollbar-hide",
        style: { scrollbarWidth: "none" }
      },
      recentlyRated.map((movie) => movie && /* @__PURE__ */ React.createElement(MovieCard, { key: movie.id, movie }))
    ))
  ), userRatings.length === 0 && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.3 },
      className: "text-center py-16"
    },
    /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "mb-4",
        style: {
          fontSize: "var(--text-card)",
          color: "var(--text-secondary)"
        }
      },
      "You haven't rated any movies yet."
    ),
    /* @__PURE__ */ React.createElement("p", { style: {
      fontSize: "var(--text-base)",
      color: "var(--text-muted)"
    } }, "Head over to the Browse page to start rating movies and get personalized recommendations!")
  )));
}
export {
  Dashboard
};
