import React from "react";
import { useApp } from "../context/AppContext";
/*import { moviesDatabase } from "../data/movies";*/
import { motion } from "motion/react";
import { Star, Film, Award } from "lucide-react";
import { useState, useEffect } from "react";

function Profile() {
  const { user, userRatings, getMovieDetails } = useApp();
  const [moviesMap, setMoviesMap] = useState({});
  useEffect(() => {
    const loadMovies = async () => {
      const entries = await Promise.all(
        userRatings.map(async (r) => {
          const movie = await getMovieDetails(r.movie_id);
          return [r.movie_id, movie];
        })); setMoviesMap(Object.fromEntries(entries));
      }; loadMovies();
  }, [userRatings]);

  if (!user) {
    return null;
  }
  const totalRatings = userRatings.length;
  const averageRating = userRatings.length > 0 ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length).toFixed(1) : "0.0";
  const genreCounts = /* @__PURE__ */ new Map();
  userRatings.forEach((rating) => {
    if (rating.rating >= 4) {
      const movie = moviesMap[rating.movie_id];
      if (movie) {
        movie.genres.forEach((genre) => {
          genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
        });
      }
    }
  });
  const favoriteGenre = genreCounts.size > 0 ? Array.from(genreCounts.entries()).sort((a, b) => b[1] - a[1])[0][0] : "None yet";
  const stats = [
    {
      icon: Film,
      label: "Movies Rated",
      value: totalRatings.toString(),
      color: "var(--accent-primary)"
    },
    {
      icon: Award,
      label: "Favorite Genre",
      value: favoriteGenre,
      color: "var(--accent-recommendation)"
    },
    {
      icon: Star,
      label: "Average Rating Given",
      value: averageRating,
      color: "var(--accent-success)"
    }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 py-12" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "mb-12"
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "p-8 rounded-2xl",
        style: { backgroundColor: "var(--bg-card)" }
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row items-center md:items-start gap-6" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: user.avatar,
          alt: user.username,
          className: "w-32 h-32 rounded-full border-4",
          style: { borderColor: "var(--accent-primary)" }
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "flex-1 text-center md:text-left" }, /* @__PURE__ */ React.createElement(
        "h1",
        {
          className: "mb-2",
          style: {
            fontSize: "var(--text-hero)",
            color: "var(--text-primary)"
          }
        },
        user.username
      ), /* @__PURE__ */ React.createElement(
        "p",
        {
          className: "mb-4",
          style: {
            fontSize: "var(--text-card)",
            color: "var(--text-secondary)"
          }
        },
        user.password
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-full",
          style: {
            backgroundColor: "var(--bg-secondary)",
            color: "var(--accent-recommendation)",
            fontSize: "var(--text-base)"
          }
        },
        /* @__PURE__ */ React.createElement(Star, { className: "w-5 h-5 fill-current" }),
        /* @__PURE__ */ React.createElement("span", null, "Movie Enthusiast")
      )))
    )
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.2 }
    },
    /* @__PURE__ */ React.createElement(
      "h2",
      {
        className: "mb-6",
        style: {
          fontSize: "var(--text-section)",
          color: "var(--text-primary)"
        }
      },
      "Your Statistics"
    ),
    /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, stats.map((stat, index) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: stat.label,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.3 + index * 0.1 },
        className: "p-6 rounded-xl",
        style: { backgroundColor: "var(--bg-card)" }
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "p-3 rounded-lg",
          style: { backgroundColor: "var(--bg-secondary)" }
        },
        /* @__PURE__ */ React.createElement(
          stat.icon,
          {
            className: "w-8 h-8",
            style: { color: stat.color }
          }
        )
      ), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement(
        "p",
        {
          className: "mb-1",
          style: {
            fontSize: "var(--text-small)",
            color: "var(--text-secondary)"
          }
        },
        stat.label
      ), /* @__PURE__ */ React.createElement(
        "p",
        {
          style: {
            fontSize: "var(--text-section)",
            color: "var(--text-primary)"
          }
        },
        stat.value
      )))
    )))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.5 },
      className: "mt-12"
    },
    /* @__PURE__ */ React.createElement(
      "h2",
      {
        className: "mb-6",
        style: {
          fontSize: "var(--text-section)",
          color: "var(--text-primary)"
        }
      },
      "Activity Summary"
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "p-6 rounded-xl",
        style: { backgroundColor: "var(--bg-card)" }
      },
      /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "var(--text-base)",
        color: "var(--text-secondary)"
      } }, "5-Star Ratings"), /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            fontSize: "var(--text-card)",
            color: "var(--text-primary)"
          }
        },
        userRatings.filter((r) => r.rating === 5).length
      )), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "var(--text-base)",
        color: "var(--text-secondary)"
      } }, "4-Star Ratings"), /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            fontSize: "var(--text-card)",
            color: "var(--text-primary)"
          }
        },
        userRatings.filter((r) => r.rating === 4).length
      )), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "var(--text-base)",
        color: "var(--text-secondary)"
      } }, "3-Star Ratings"), /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            fontSize: "var(--text-card)",
            color: "var(--text-primary)"
          }
        },
        userRatings.filter((r) => r.rating === 3).length
      )), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "var(--text-base)",
        color: "var(--text-secondary)"
      } }, "1-2 Star Ratings"), /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            fontSize: "var(--text-card)",
            color: "var(--text-primary)"
          }
        },
        userRatings.filter((r) => r.rating <= 2).length
      )))
    )
  )));
}
export {
  Profile
};
