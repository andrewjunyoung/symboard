import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";

const downloadableName = "oneboard.zip"
const downloadable = `/${downloadableName}`

function App() {
  // List of greetings in different languages
  const greetings = [
    { text: "Hello", language: "English" },
    { text: "Bonjour", language: "French" },
    { text: "Hola", language: "Spanish" },
    { text: "こんにちは", language: "Japanese" },
    { text: "Ciao", language: "Japanese" },
    { text: "Namaste", language: "Hindi" },
    { text: "سلام", language: "Arabic" },
    { text: "你好", language: "Chinese" },
    { text: "Guten Tag", language: "German" },
    { text: "안녕", language: "Korean" },
    { text: "Здравствуйте", language: "Russian" },
    { text: "Olá", language: "Portuguese" },
    { text: "Merhaba", language: "Turkish" },
    { text: "Сәлем", language: "Kazakh" },
    { text: "สวัสดี", language: "Thai" },
    { text: "Xin chào", language: "Vietnamese" },
    { text: "Γειά σου", language: "Greek" },
    { text: "नमस्ते", language: "Hindi" },
    { text: "שָׁלוֹם", language: "Hebrew" },
    { text: "Hallå", language: "Swedish" },
    { text: "Dzień dobry", language: "Polish" },
    { text: "イランカラプテ", lanugage: "Ainu" },
    { text: "ðə kwɪk braʊn foks dʒʌmpt", language: "Calculus" },
    { text: "∫ₐᵇ f(x) dx = lim(n→∞) Σᵢ₌₁ⁿ f(xᵢ*) Δx", lanugage: "Math" },
    { text: "iℏ∂Ψ/∂t = ĤΨ", language: "Physics" },
    { text: "N = N₀e⁻ᵏᵗ", language: "Chemistry" },
  ];

  const handleDownload = () => {
    fetch(downloadable)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadableName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
  };

  // Generate random positions and styles for the symbols
  const getRandomSymbolStyle = (index) => {
    const size = 30 + Math.random() * 70; // Font size between 30px and 100px
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const rotate = Math.random() * 20 - 10; // Rotate between -10 and 10 degrees
    const delay = Math.random() * 10;

    return {
      fontSize: `${size}px`,
      left: `${left}%`,
      top: `${top}%`,
      transform: `rotate(${rotate}deg)`,
      animationDelay: `${delay}s`,
    };
  };

  return (
    <div className="app-container">
      <NavBar />
      
      <div className="container">
        {/* Animated background gradient */}
        <div className="background-gradient">
          {/* Greeting background */}
          <div className="greeting-background">
            {greetings.map((text, i) => (
              <div key={i} className="greeting" style={getRandomSymbolStyle(i)}>
                {text.text}
              </div>
            ))}
          </div>
        </div>

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

        {/* Static subtle glow effect */}
        <div className="spotlight"></div>

        {/* Main content */}
        <div className="content">
          <div className="content-wrapper">
            <h1 className="main-heading">Oneβöard</h1>
            <p className="tagline">
              Type <span className="highlight">anything</span>. Even π, ʃ, あ,
              العربية ᴀɴᴅ 😍 without switching keyboards.
            </p>

            <div className="features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">
                  Type by shape or sound - intuitive & fast
                </span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">
                  Universal across 50+ languages & scripts
                </span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span className="feature-text">
                  No more copying & pasting symbols
                </span>
              </div>
            </div>

            <button className={`download-button`} onClick={handleDownload}>
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
      </div>
    </div>
  );
}

export default App;
