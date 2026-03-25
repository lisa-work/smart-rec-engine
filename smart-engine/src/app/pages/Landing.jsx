import React from "react";
import { useNavigate } from "react-router";
import { Film, Star, Search } from "lucide-react";
import { motion } from "motion/react";
function Landing() {
  const navigate = useNavigate();
  const features = [
    {
      icon: Search,
      title: "Browse Movies",
      description: "Explore our extensive collection of films across all genres"
    },
    {
      icon: Star,
      title: "Rate Films",
      description: "Share your opinions by rating movies you've watched"
    },
    {
      icon: Film,
      title: "Get Personalized Recommendations",
      description: "Discover movies tailored to your unique taste"
    }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 opacity-20" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "absolute inset-0",
      style: {
        backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(4px)"
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "absolute inset-0",
      style: {
        background: "linear-gradient(to bottom, rgba(15, 17, 21, 0.7), rgba(15, 17, 21, 0.95))"
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "relative max-w-[1280px] mx-auto px-6 py-32" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "text-center max-w-4xl mx-auto"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex justify-center mb-8" }, /* @__PURE__ */ React.createElement(Film, { className: "w-20 h-20", style: { color: "var(--accent-primary)" } })),
    /* @__PURE__ */ React.createElement(
      "h1",
      {
        className: "mb-6",
        style: {
          fontSize: "48px",
          color: "var(--text-primary)"
        }
      },
      "Discover Movies You'll Actually Love"
    ),
    /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "mb-12 max-w-2xl mx-auto",
        style: {
          fontSize: "var(--text-card)",
          color: "var(--text-secondary)",
          lineHeight: "1.6"
        }
      },
      "Get intelligent movie recommendations based on your personal taste. Rate films, explore new genres, and never waste time on movies you won't enjoy."
    ),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 justify-center" }, /* @__PURE__ */ React.createElement(
      motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: () => navigate("/login"),
        className: "px-8 py-4 rounded-lg shadow-lg transition-all",
        style: {
          backgroundColor: "var(--accent-primary)",
          color: "white",
          fontSize: "var(--text-card)"
        }
      },
      "Get Started"
    ), /* @__PURE__ */ React.createElement(
      motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: () => navigate("/login"),
        className: "px-8 py-4 rounded-lg border-2 transition-all",
        style: {
          borderColor: "var(--accent-primary)",
          color: "var(--accent-primary)",
          fontSize: "var(--text-card)"
        }
      },
      "Login"
    ))
  ))), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "py-24",
      style: { backgroundColor: "var(--bg-secondary)" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-12" }, features.map((feature, index) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: feature.title,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.2 },
        className: "text-center"
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex justify-center mb-6" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "p-6 rounded-2xl",
          style: { backgroundColor: "var(--bg-card)" }
        },
        /* @__PURE__ */ React.createElement(
          feature.icon,
          {
            className: "w-12 h-12",
            style: { color: "var(--accent-primary)" }
          }
        )
      )),
      /* @__PURE__ */ React.createElement(
        "h3",
        {
          className: "mb-4",
          style: {
            fontSize: "var(--text-section)",
            color: "var(--text-primary)"
          }
        },
        feature.title
      ),
      /* @__PURE__ */ React.createElement(
        "p",
        {
          style: {
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            lineHeight: "1.6"
          }
        },
        feature.description
      )
    ))))
  ), /* @__PURE__ */ React.createElement("div", { className: "py-24" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "text-center max-w-3xl mx-auto p-12 rounded-2xl",
      style: { backgroundColor: "var(--bg-card)" }
    },
    /* @__PURE__ */ React.createElement(
      "h2",
      {
        className: "mb-4",
        style: {
          fontSize: "var(--text-section)",
          color: "var(--text-primary)"
        }
      },
      "Ready to find your next favorite movie?"
    ),
    /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "mb-8",
        style: {
          fontSize: "var(--text-base)",
          color: "var(--text-secondary)"
        }
      },
      "Join thousands of movie lovers discovering films they actually enjoy"
    ),
    /* @__PURE__ */ React.createElement(
      motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: () => navigate("/login"),
        className: "px-8 py-4 rounded-lg shadow-lg",
        style: {
          backgroundColor: "var(--accent-primary)",
          color: "white",
          fontSize: "var(--text-card)"
        }
      },
      "Get Started Free"
    )
  ))));
}
export {
  Landing
};
