import React from "react";
import { StarRating } from "./StarRating";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
function MovieCard({ movie, isRecommended = false }) {
  const { getRatingForMovie, addRating, updateRating } = useApp();
  const navigate = useNavigate();
  const userRating = getRatingForMovie(movie.id);
  const handleRate = (rating) => {
    if (userRating !== null) {
      updateRating(movie.id, rating);
    } else {
      addRating(movie.id, rating);
    }
  };
  const handleCardClick = (e) => {
    if (e.target.closest(".star-rating-container")) {
      return;
    }
    navigate(`/movie/${movie.id}`);
  };
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      whileHover: { y: -8, scale: 1.02 },
      transition: { duration: 0.2 },
      onClick: handleCardClick,
      className: "group cursor-pointer"
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
      /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden", style: { height: "360px" } }, /* @__PURE__ */ React.createElement(
        motion.img,
        {
          src: movie.posterUrl,
          alt: movie.title,
          className: "w-full h-full object-cover",
          whileHover: { scale: 1.1 },
          transition: { duration: 0.3 }
        }
      ), isRecommended && /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "absolute top-3 right-3 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5",
          style: {
            backgroundColor: "rgba(255, 209, 102, 0.9)",
            fontSize: "var(--text-caption)"
          }
        },
        /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, "\u2B50"),
        /* @__PURE__ */ React.createElement("span", { style: { color: "var(--bg-primary)" } }, "Recommended")
      )),
      /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
        "h3",
        {
          className: "line-clamp-2 mb-1",
          style: {
            fontSize: "var(--text-card)",
            color: "var(--text-primary)"
          }
        },
        movie.title
      ), /* @__PURE__ */ React.createElement("p", { style: {
        fontSize: "var(--text-small)",
        color: "var(--text-muted)"
      } }, movie.year)), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5" }, movie.genres.slice(0, 3).map((genre) => /* @__PURE__ */ React.createElement(
        "span",
        {
          key: genre,
          className: "px-2 py-1 rounded",
          style: {
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            fontSize: "var(--text-caption)"
          }
        },
        genre
      ))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(StarRating, { rating: movie.averageRating, readonly: true, size: "sm" }), /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "var(--text-small)",
        color: "var(--text-secondary)"
      } }, movie.averageRating.toFixed(1))), /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t", style: { borderColor: "var(--border)" } }, /* @__PURE__ */ React.createElement(
        "p",
        {
          className: "mb-2",
          style: {
            fontSize: "var(--text-small)",
            color: "var(--text-secondary)"
          }
        },
        userRating ? "Your rating:" : "Rate this movie:"
      ), /* @__PURE__ */ React.createElement("div", { className: "star-rating-container", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement(
        StarRating,
        {
          rating: userRating,
          onRate: handleRate,
          size: "md"
        }
      ))))
    )
  );
}
export {
  MovieCard
};
