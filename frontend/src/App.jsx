import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleDownload = () => {
    // Animation will be triggered by CSS
    // In a real app, you would initiate your download here
    console.log("Download initiated");
  };

  return (
    <div className="container">
      {/* Animated background gradient */}
      <div className="background-gradient"></div>

      {/* Decorative elements */}
      <div className="floating-circles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="circle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 15}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Interactive spotlight effect */}
      <div
        className="spotlight"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%)`,
        }}
      ></div>

      {/* Main content */}
      <div className="content">
        <button
          className={`download-button ${isHovering ? "hover" : ""}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleDownload}
        >
          <span className="button-text">Download</span>
          <span className="button-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16L12 8M12 16L8 12M12 16L16 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default App;
