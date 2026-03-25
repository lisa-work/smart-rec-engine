import React from "react";
function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, genres.map((genre) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: genre,
      onClick: () => onSelectGenre(genre),
      className: `
            px-4 py-2 rounded-full transition-all duration-200
            ${selectedGenre === genre ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20" : "bg-[var(--muted)] text-white hover:bg-[var(--muted)]/80"}
          `,
      style: {
        fontSize: "var(--text-small)"
      }
    },
    genre
  )));
}
export {
  GenreFilter
};
