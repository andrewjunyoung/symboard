import React from "react";

const KeyboardLegend = () => {
  return (
    <div
      className="keyboard-legend"
      style={{
        display: "flex",
        marginLeft: "auto",
        gap: "15px",
        fontSize: "14px",
        fontFamily: '"Arial", sans-serif',
        color: "#ffffff",
      }}
    >
      <span
        className="legend-item"
        style={{
          position: "relative",
          cursor: "help",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
        onMouseEnter={(e) => {
          const tooltip = e.currentTarget.querySelector(".tooltip");
          if (tooltip) tooltip.style.display = "block";
        }}
        onMouseLeave={(e) => {
          const tooltip = e.currentTarget.querySelector(".tooltip");
          if (tooltip) tooltip.style.display = "none";
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#0066a0",
            borderRadius: "2px",
          }}
        ></div>
        Mode<sup>(?)</sup>
        <div
          className="tooltip"
          style={{
            display: "none",
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            width: "200px",
            zIndex: 100,
            fontSize: "12px",
            fontFamily: '"Arial", sans-serif',
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          A mode (or dead key) allows you to type special characters by pressing
          a sequence of keys. Press the mode key first, then the target key to
          produce a modified character.
        </div>
      </span>

      <span
        className="legend-item"
        style={{
          position: "relative",
          cursor: "help",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
        onMouseEnter={(e) => {
          const tooltip = e.currentTarget.querySelector(".tooltip");
          if (tooltip) tooltip.style.display = "block";
        }}
        onMouseLeave={(e) => {
          const tooltip = e.currentTarget.querySelector(".tooltip");
          if (tooltip) tooltip.style.display = "none";
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#0088cc",
            borderRadius: "2px",
          }}
        ></div>
        Diacritic<sup>(?)</sup>
        <div
          className="tooltip"
          style={{
            display: "none",
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            width: "200px",
            zIndex: 100,
            fontSize: "12px",
            fontFamily: '"Arial", sans-serif',
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          A diacritic is a mark added to a letter that modifies its
          pronunciation or meaning, such as accents (é), umlauts (ü), or
          cedillas (ç). These are accessed using mode keys.
        </div>
      </span>
    </div>
  );
};

export default KeyboardLegend;
