import React from "react";
import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
function Layout() {
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: "var(--bg-primary)" } }, /* @__PURE__ */ React.createElement(Navigation, null), /* @__PURE__ */ React.createElement(Outlet, null));
}
export {
  Layout
};
