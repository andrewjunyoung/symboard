import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import DemoPage from "./pages/DemoPage";

function App() {
  return (
    <Router>
    <div className="app-container">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<DemoPage />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
