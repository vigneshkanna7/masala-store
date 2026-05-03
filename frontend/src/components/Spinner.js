import React from "react";

const Spinner = ({ size = "sm", color = "white" }) => {
  const dimension = size === "sm" ? "20px" : "40px";
  const borderColor = color === "white" ? "#ffffff" : "#f97316";

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        border: `4px solid ${borderColor}`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Spinner;