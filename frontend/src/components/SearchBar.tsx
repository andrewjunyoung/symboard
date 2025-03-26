import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
  };

  return (
    <div
      className="search-bar"
      style={{
        width: "100%",
        display: "flex",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <input
        type="text"
        placeholder="Search for a char here"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        style={{
          flex: 1,
          padding: "8px 12px",
          border: "none",
          outline: "none",
          fontSize: "14px",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          background: "#f0f0f0",
          border: "none",
          borderLeft: "1px solid #ccc",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
