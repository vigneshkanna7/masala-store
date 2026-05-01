import React from "react";

const Spinner = ({ size = "sm", color = "white" }) => {
  const sizeClass = size === "sm" ? "h-5 w-5" : "h-10 w-10";
  const colorClass = color === "white" ? "border-white" : "border-orange-500";

  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent ${sizeClass} ${colorClass}`}
    />
  );
};

export default Spinner;