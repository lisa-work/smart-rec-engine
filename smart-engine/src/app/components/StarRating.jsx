import React from "react";
import { Star } from "lucide-react";
import { useState } from "react";
function StarRating({
  rating,
  onRate,
  readonly = false,
  size = "md",
  showValue = false
}) {
  const [hoverRating, setHoverRating] = useState(null);
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };
  const displayRating = hoverRating ?? rating ?? 0;
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-0.5" }, [1, 2, 3, 4, 5].map((value) => {
    const isFilled = value <= displayRating;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: value,
        type: "button",
        onClick: () => handleClick(value),
        onMouseEnter: () => !readonly && setHoverRating(value),
        onMouseLeave: () => !readonly && setHoverRating(null),
        disabled: readonly,
        className: `
                transition-all duration-200
                ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}
              `
      },
      /* @__PURE__ */ React.createElement(
        Star,
        {
          className: `
                  ${sizeClasses[size]}
                  transition-colors duration-200
                  ${isFilled ? "fill-[var(--star-filled)] stroke-[var(--star-filled)]" : "fill-none stroke-[var(--star-empty)]"}
                `
        }
      )
    );
  })), showValue && rating !== null && /* @__PURE__ */ React.createElement("span", { className: "text-sm ml-1", style: { color: "var(--text-secondary)" } }, rating.toFixed(1)));
}
export {
  StarRating
};
