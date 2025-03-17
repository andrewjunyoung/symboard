import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <HomePage />
    </div>
  );
}

export default App;
