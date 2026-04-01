import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Film } from "lucide-react";
import { motion } from "motion/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
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
        error ? /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "mb-4 p-3 rounded-lg",
            style: {
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderLeft: "4px solid rgb(239, 68, 68)",
              color: "rgb(239, 68, 68)",
            }
          },
          error
        ) : null,
        /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
          "label",
          {
            htmlFor: "email",
            className: "block mb-2",
            style: {
              fontSize: "var(--text-base)",
              color: "var(--text-primary)"
            }
          },
          "Email"
        ), /* @__PURE__ */ React.createElement(
          "input",
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            disabled: loading,
            placeholder: "Enter your email",
            className: "w-full px-4 py-3 rounded-lg outline-none focus:ring-2 transition-all disabled:opacity-50",
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
            onChange: (e) => setPassword(e.target.value),
            required: true,
            disabled: loading,
            placeholder: "Enter your password",
            className: "w-full px-4 py-3 rounded-lg outline-none focus:ring-2 transition-all disabled:opacity-50",
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
            whileHover: { scale: loading ? 1 : 1.02 },
            whileTap: { scale: loading ? 1 : 0.98 },
            type: "submit",
            disabled: loading,
            className: "w-full py-3 rounded-lg shadow-lg transition-all font-medium disabled:opacity-50",
            style: {
              backgroundColor: "var(--accent-primary)",
              color: "white",
              fontSize: "var(--text-base)"
            }
          },
          loading ? "Logging in..." : "Login"
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
          "Powered by Supabase Authentication"
        )
      )
    )
  );
}

export {
  Login
};
