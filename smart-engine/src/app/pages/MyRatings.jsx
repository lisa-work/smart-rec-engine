import React from "react";
import { useApp } from "../context/AppContext";
/*import { moviesDatabase } from "../data/movies";*/
import { StarRating } from "../components/StarRating";
import { motion } from "motion/react";
import { Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

function MyRatings() {
  const { userRatings, deleteRating, updateRating, getMovieDetails } = useApp();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const loadRatedMovies = async () => {
        setIsLoading(true);
        const results = await Promise.all(
          userRatings.map(async (rating) => {
            const movie = await getMovieDetails(rating.movie_id);
            return { rating, movie };
        })); 
        setRatedMovies(results.filter(r => r.movie));
        setIsLoading(false);
      }; 
      if (userRatings.length > 0) {
        loadRatedMovies();
      } else {
        setRatedMovies([]);
        setIsLoading(false);
      }
    }, [userRatings]);
  const handleDelete = (movie_id) => {
    if (confirm("Are you sure you want to delete this rating?")) {
      deleteRating(movie_id);
    }
  };
  const handleUpdateRating = (movie_id, newRating) => {
    updateRating(movie_id, newRating);
    setEditingId(null);
  };
  if (isLoading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 py-12" }, /* @__PURE__ */ React.createElement(
      "h1",
      {
        className: "mb-8",
        style: {
          fontSize: "var(--text-hero)",
          color: "var(--text-primary)"
        }
      },
      "My Ratings"
    ), /* @__PURE__ */ React.createElement("div", { className: "text-center py-16" }, /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "mb-4",
        style: {
          fontSize: "var(--text-card)",
          color: "var(--text-secondary)"
        }
      },
      "Loading..."
    ))));
  }
  if (ratedMovies.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 py-12" }, /* @__PURE__ */ React.createElement(
      "h1",
      {
        className: "mb-8",
        style: {
          fontSize: "var(--text-hero)",
          color: "var(--text-primary)"
        }
      },
      "My Ratings"
    ), /* @__PURE__ */ React.createElement("div", { className: "text-center py-16" }, /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "mb-4",
        style: {
          fontSize: "var(--text-card)",
          color: "var(--text-secondary)"
        }
      },
      "You haven't rated any movies yet"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => navigate("/browse"),
        className: "px-6 py-3 rounded-lg",
        style: {
          backgroundColor: "var(--accent-primary)",
          color: "white"
        }
      },
      "Browse Movies"
    ))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 py-12" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "mb-8"
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
      "My Ratings"
    ),
    /* @__PURE__ */ React.createElement("p", { style: {
      fontSize: "var(--text-base)",
      color: "var(--text-secondary)"
    } }, "You've rated ", ratedMovies.length, " movie", ratedMovies.length === 1 ? "" : "s")
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.2 },
      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center"
    },
    ratedMovies.map(({ rating, movie }, index) => {
      if (!movie) return null;
      return /* @__PURE__ */ React.createElement(
        motion.div,
        {
          key: movie.id,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: Math.min(index * 0.05, 0.5) }
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "rounded-lg overflow-hidden shadow-lg transition-all duration-200",
            style: {
              backgroundColor: "var(--bg-card)",
              width: "240px"
            }
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              className: "cursor-pointer",
              onClick: () => navigate(`/movie/${movie.id}`),
              style: { height: "360px" }
            },
            /* @__PURE__ */ React.createElement(
              "img",
              {
                src: movie.posterUrl,
                alt: movie.title,
                className: "w-full h-full object-cover hover:opacity-90 transition-opacity"
              }
            )
          ),
          /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-3" }, /* @__PURE__ */ React.createElement(
            "div",
            {
              className: "cursor-pointer",
              onClick: () => navigate(`/movie/${movie.id}`)
            },
            /* @__PURE__ */ React.createElement(
              "h3",
              {
                className: "line-clamp-2 mb-1",
                style: {
                  fontSize: "var(--text-card)",
                  color: "var(--text-primary)"
                }
              },
              movie.title
            ),
            /* @__PURE__ */ React.createElement("p", { style: {
              fontSize: "var(--text-small)",
              color: "var(--text-muted)"
            } }, movie.year)
          ), /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t", style: { borderColor: "var(--border)" } }, editingId === movie.id ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
            "p",
            {
              className: "mb-2",
              style: {
                fontSize: "var(--text-small)",
                color: "var(--text-secondary)"
              }
            },
            "Edit your rating:"
          ), /* @__PURE__ */ React.createElement(
            StarRating,
            {
              rating: rating.rating,
              onRate: (newRating) => handleUpdateRating(movie.id, newRating),
              size: "md"
            }
          )) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
            "p",
            {
              className: "mb-2",
              style: {
                fontSize: "var(--text-small)",
                color: "var(--text-secondary)"
              }
            },
            "Your rating:"
          ), /* @__PURE__ */ React.createElement(
            StarRating,
            {
              rating: rating.rating,
              readonly: true,
              size: "md"
            }
          ))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 pt-2" }, /* @__PURE__ */ React.createElement(
            "button",
            {
              onClick: () => setEditingId(editingId === movie.id ? null : movie.id),
              className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors",
              style: {
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "var(--text-small)"
              }
            },
            /* @__PURE__ */ React.createElement(Edit2, { className: "w-4 h-4" }),
            editingId === movie.id ? "Cancel" : "Edit"
          ), /* @__PURE__ */ React.createElement(
            "button",
            {
              onClick: () => handleDelete(movie.id),
              className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors",
              style: {
                backgroundColor: "var(--bg-secondary)",
                color: "var(--accent-primary)",
                fontSize: "var(--text-small)"
              }
            },
            /* @__PURE__ */ React.createElement(Trash2, { className: "w-4 h-4" }),
            "Delete"
          )))
        )
      );
    })
  )));
}
export {
  MyRatings
};
