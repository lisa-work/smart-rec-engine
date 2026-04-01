import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, User, LogOut, Star, Film, LayoutDashboard, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useState } from "react";
function Navigation() {
  const { user, isAuthenticated, logout, searchQuery, setSearchQuery } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/browse");
    }
  };
  const navLinks = isAuthenticated ? [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/browse", label: "Browse", icon: Film },
    { path: "/my-ratings", label: "My Ratings", icon: Star }
  ] : [];
  return /* @__PURE__ */ React.createElement(
    "nav",
    {
      className: "sticky top-0 z-50 border-b",
      style: {
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
        height: "72px"
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between gap-8" }, /* @__PURE__ */ React.createElement(
      Link,
      {
        to: isAuthenticated ? "/dashboard" : "/",
        className: "flex items-center gap-2 shrink-0"
      },
      /* @__PURE__ */ React.createElement(Film, { className: "w-8 h-8", style: { color: "var(--accent-primary)" } }),
      /* @__PURE__ */ React.createElement(
        "span",
        {
          className: "hidden sm:block",
          style: {
            fontSize: "var(--text-section)",
            color: "var(--text-primary)"
          }
        },
        "MovieMind"
      )
    ), isAuthenticated && /* @__PURE__ */ React.createElement(
      "form",
      {
        onSubmit: handleSearch,
        className: "hidden md:flex flex-1 max-w-md"
      },
      /* @__PURE__ */ React.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ React.createElement(
        Search,
        {
          className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
          style: { color: "var(--text-muted)" }
        }
      ), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search movies...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "w-full pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 transition-all",
          style: {
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
            fontSize: "var(--text-base)"
          }
        }
      ))
    ), /* @__PURE__ */ React.createElement("div", { className: "hidden md:flex items-center gap-6" }, navLinks.map(({ path, label, icon: Icon }) => /* @__PURE__ */ React.createElement(
      Link,
      {
        key: path,
        to: path,
        className: "transition-colors",
        style: {
          color: location.pathname === path ? "var(--accent-primary)" : "var(--text-secondary)",
          fontSize: "var(--text-base)"
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Icon, { className: "w-5 h-5" }), label)
    )), isAuthenticated && user ? /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement(
      Link,
      {
        to: "/profile",
        className: "flex items-center gap-2 transition-colors",
        style: { color: "var(--text-primary)" }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "w-8 h-8 rounded-full flex items-center justify-center",
          style: {
            backgroundColor: "var(--accent-primary)",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold"
          }
        },
        user?.email?.[0]?.toUpperCase() || "U"
      ),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--text-base)" } }, user.username)
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleLogout,
        className: "p-2 rounded-lg transition-colors hover:bg-[var(--bg-secondary)]",
        title: "Logout"
      },
      /* @__PURE__ */ React.createElement(LogOut, { className: "w-5 h-5", style: { color: "var(--text-secondary)" } })
    )) : /* @__PURE__ */ React.createElement(
      Link,
      {
        to: "/login",
        className: "px-4 py-2 rounded-lg transition-all",
        style: {
          backgroundColor: "var(--accent-primary)",
          color: "white"
        }
      },
      "Login"
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setMobileMenuOpen(!mobileMenuOpen),
        className: "md:hidden p-2"
      },
      mobileMenuOpen ? /* @__PURE__ */ React.createElement(X, { className: "w-6 h-6", style: { color: "var(--text-primary)" } }) : /* @__PURE__ */ React.createElement(Menu, { className: "w-6 h-6", style: { color: "var(--text-primary)" } })
    )),
    mobileMenuOpen && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "md:hidden border-t",
        style: {
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border)"
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 space-y-4" }, isAuthenticated && /* @__PURE__ */ React.createElement("form", { onSubmit: handleSearch }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
        Search,
        {
          className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
          style: { color: "var(--text-muted)" }
        }
      ), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          placeholder: "Search movies...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "w-full pl-10 pr-4 py-2 rounded-lg outline-none",
          style: {
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            fontSize: "var(--text-base)"
          }
        }
      ))), navLinks.map(({ path, label, icon: Icon }) => /* @__PURE__ */ React.createElement(
        Link,
        {
          key: path,
          to: path,
          onClick: () => setMobileMenuOpen(false),
          className: "flex items-center gap-3 py-2",
          style: {
            color: location.pathname === path ? "var(--accent-primary)" : "var(--text-primary)",
            fontSize: "var(--text-base)"
          }
        },
        /* @__PURE__ */ React.createElement(Icon, { className: "w-5 h-5" }),
        label
      )), isAuthenticated && user ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        Link,
        {
          to: "/profile",
          onClick: () => setMobileMenuOpen(false),
          className: "flex items-center gap-3 py-2",
          style: { color: "var(--text-primary)" }
        },
        /* @__PURE__ */ React.createElement(User, { className: "w-5 h-5" }),
        "Profile"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: handleLogout,
          className: "flex items-center gap-3 py-2 w-full text-left",
          style: { color: "var(--text-primary)" }
        },
        /* @__PURE__ */ React.createElement(LogOut, { className: "w-5 h-5" }),
        "Logout"
      )) : /* @__PURE__ */ React.createElement(
        Link,
        {
          to: "/login",
          onClick: () => setMobileMenuOpen(false),
          className: "block px-4 py-2 rounded-lg text-center",
          style: {
            backgroundColor: "var(--accent-primary)",
            color: "white"
          }
        },
        "Login"
      ))
    )
  );
}
export {
  Navigation
};
