import React, { useRef } from "react";
import Keyboard from "../components/Keyboard";
import SearchBar from "../components/SearchBar";
import "./DemoPage.css";

const DemoPage: React.FC = () => {
  const keyboardRef = useRef(null);

  const handleSearch = (query: string) => {
    if (keyboardRef.current) {
      keyboardRef.current.searchKeyOutput(query);
    }
  };

  return (
    <div className="demo-page">
      <div className="demo-content">
        <h1>Oneboard Demo</h1>
        <p>Experience our universal keyboard layout</p>
        <SearchBar onSearch={handleSearch} />
        <Keyboard ref={keyboardRef} />
      </div>
    </div>
  );
};

export default DemoPage;
