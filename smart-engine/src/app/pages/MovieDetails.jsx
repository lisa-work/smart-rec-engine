import React from "react";
import { useParams, useNavigate } from "react-router";
import { moviesDatabase } from "../data/movies";
import { StarRating } from "../components/StarRating";
import { MovieCard } from "../components/MovieCard";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRatingForMovie, addRating, updateRating } = useApp();
  const movie = moviesDatabase.find((m) => m.id === Number(id));
  const userRating = movie ? getRatingForMovie(movie.id) : null;
  if (!movie) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "min-h-screen flex items-center justify-center",
        style: { backgroundColor: "var(--bg-primary)" }
      },
      /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement(
        "p",
        {
          className: "mb-4",
          style: {
            fontSize: "var(--text-section)",
            color: "var(--text-primary)"
          }
        },
        "Movie not found"
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
        "Back to Browse"
      ))
    );
  }
  const handleRate = (rating) => {
    if (userRating !== null) {
      updateRating(movie.id, rating);
    } else {
      addRating(movie.id, rating);
    }
  };
  const similarMovies = moviesDatabase.filter(
    (m) => m.id !== movie.id && m.genres.some((genre) => movie.genres.includes(genre))
  ).slice(0, 4);
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "border-b",
      style: { borderColor: "var(--border)" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 py-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => navigate(-1),
        className: "flex items-center gap-2 transition-colors",
        style: { color: "var(--text-secondary)" }
      },
      /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-5 h-5" }),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--text-base)" } }, "Back")
    ))
  ), /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 py-12" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex justify-center lg:justify-start" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "rounded-2xl overflow-hidden shadow-2xl",
        style: {
          width: "400px",
          height: "600px"
        }
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: movie.posterUrl,
          alt: movie.title,
          className: "w-full h-full object-cover"
        }
      )
    )),
    /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "h1",
      {
        className: "mb-3",
        style: {
          fontSize: "var(--text-hero)",
          color: "var(--text-primary)"
        }
      },
      movie.title
    ), /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "mb-4",
        style: {
          fontSize: "var(--text-card)",
          color: "var(--text-secondary)"
        }
      },
      movie.year
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "h3",
      {
        className: "mb-3",
        style: {
          fontSize: "var(--text-base)",
          color: "var(--text-primary)"
        }
      },
      "Genres"
    ), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, movie.genres.map((genre) => /* @__PURE__ */ React.createElement(
      "span",
      {
        key: genre,
        className: "px-4 py-2 rounded-full",
        style: {
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          fontSize: "var(--text-base)"
        }
      },
      genre
    )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "h3",
      {
        className: "mb-3",
        style: {
          fontSize: "var(--text-base)",
          color: "var(--text-primary)"
        }
      },
      "Average Rating"
    ), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(StarRating, { rating: movie.averageRating, readonly: true, size: "lg" }), /* @__PURE__ */ React.createElement(
      "span",
      {
        style: {
          fontSize: "var(--text-card)",
          color: "var(--text-primary)"
        }
      },
      movie.averageRating.toFixed(1),
      " / 5.0"
    ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "h3",
      {
        className: "mb-3",
        style: {
          fontSize: "var(--text-base)",
          color: "var(--text-primary)"
        }
      },
      "Description"
    ), /* @__PURE__ */ React.createElement(
      "p",
      {
        style: {
          fontSize: "var(--text-base)",
          color: "var(--text-secondary)",
          lineHeight: "1.7"
        }
      },
      movie.description
    )), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "p-6 rounded-xl",
        style: { backgroundColor: "var(--bg-card)" }
      },
      /* @__PURE__ */ React.createElement(
        "h3",
        {
          className: "mb-4",
          style: {
            fontSize: "var(--text-card)",
            color: "var(--text-primary)"
          }
        },
        userRating ? "Your Rating" : "Rate This Movie"
      ),
      /* @__PURE__ */ React.createElement(
        StarRating,
        {
          rating: userRating,
          onRate: handleRate,
          size: "lg"
        }
      ),
      userRating && /* @__PURE__ */ React.createElement(
        "p",
        {
          className: "mt-3",
          style: {
            fontSize: "var(--text-small)",
            color: "var(--text-secondary)"
          }
        },
        "You rated this movie ",
        userRating,
        " / 5 stars"
      )
    ))
  ), similarMovies.length > 0 && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay: 0.3 }
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
      "Similar Movies"
    ),
    /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center" }, similarMovies.map((similarMovie, index) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: similarMovie.id,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: index * 0.1 }
      },
      /* @__PURE__ */ React.createElement(MovieCard, { movie: similarMovie })
    )))
  )));
}
export {
  MovieDetails
};
