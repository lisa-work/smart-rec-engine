import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Film } from "lucide-react";
import { motion } from "motion/react";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const { login } = useApp();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login(username, password);
      navigate("/dashboard");
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "min-h-screen flex items-center justify-center px-6",
      style: { backgroundColor: "var(--bg-primary)" }
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        className: "w-full max-w-md"
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "p-8 rounded-2xl shadow-2xl",
          style: { backgroundColor: "var(--bg-card)" }
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex justify-center mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Film, { className: "w-10 h-10", style: { color: "var(--accent-primary)" } }), /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontSize: "var(--text-section)",
              color: "var(--text-primary)"
            }
          },
          "MovieMind"
        ))),
        /* @__PURE__ */ React.createElement("div", { className: "text-center mb-8" }, /* @__PURE__ */ React.createElement(
          "h2",
          {
            className: "mb-2",
            style: {
              fontSize: "var(--text-section)",
              color: "var(--text-primary)"
            }
          },
          "Welcome Back"
        ), /* @__PURE__ */ React.createElement("p", { style: {
          fontSize: "var(--text-base)",
          color: "var(--text-secondary)"
        } }, "Login to discover your next favorite movie")),
        /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
          "label",
          {
            htmlFor: "username",
            className: "block mb-2",
            style: {
              fontSize: "var(--text-base)",
              color: "var(--text-primary)"
            }
          },
          "Username"
        ), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "username",
            type: "text",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            required: true,
            placeholder: "Enter your username",
            className: "w-full px-4 py-3 rounded-lg outline-none focus:ring-2 transition-all",
            style: {
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
              fontSize: "var(--text-base)"
            }
          }
        )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
          "label",
          {
            htmlFor: "password",
            className: "block mb-2",
            style: {
              fontSize: "var(--text-base)",
              color: "var(--text-primary)"
            }
          },
          "Password"
        ), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "password",
            type: "password",
            value: password,
            onChange: (e) => setpassword(e.target.value),
            required: true,
            placeholder: "Enter your password",
            className: "w-full px-4 py-3 rounded-lg outline-none focus:ring-2 transition-all",
            style: {
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
              fontSize: "var(--text-base)"
            }
          }
        )), /* @__PURE__ */ React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            type: "submit",
            className: "w-full py-3 rounded-lg shadow-lg transition-all",
            style: {
              backgroundColor: "var(--accent-primary)",
              color: "white",
              fontSize: "var(--text-base)"
            }
          },
          "Login"
        )),
        /* @__PURE__ */ React.createElement(
          "p",
          {
            className: "mt-6 text-center",
            style: {
              fontSize: "var(--text-small)",
              color: "var(--text-muted)"
            }
          },
          "Note: This is a demo. Your data is stored locally in your browser."
        )
      )
    )
  );
}
export {
  Login
};
