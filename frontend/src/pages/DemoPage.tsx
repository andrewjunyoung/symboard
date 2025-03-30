import { useRef, useState } from "react";
import Keyboard from "../components/Keyboard";
import SearchBar from "../components/SearchBar";
import "./DemoPage.css";

const DemoPage: React.FC = () => {
  const keyboardRef = useRef(null);
  const [searchResult, setSearchResult] = useState<{
    complete: boolean;
    message?: string;
  } | null>(null);

  const handleSearch = (query: string) => {
    if (keyboardRef.current) {
      const result = keyboardRef.current.searchKeyOutput(query);
      if (result) {
        const deadKeyText = result.deadKey
          ? `${result.deadKey.press} + ${result.deadKey.code} → `
          : "";
        const keyPressText = result.keyPress ? `${result.keyPress} + ` : " ";
        const text = `Press ${deadKeyText}${keyPressText}${result.code}`;
        setSearchResult({
          complete: true,
          message: text,
        });
      } else {
        setSearchResult({
          complete: true,
          message: `No key found for "${query}"`,
        });
      }
    } else {
      setSearchResult({
        complete: false,
        message: null,
      });
    }
  };

  return (
    <div className="demo-page">
      <div className="demo-content">
        <h1>Oneboard Demo</h1>
        <p>Experience our universal keyboard layout</p>
        <SearchBar onSearch={handleSearch} />
        {searchResult && (
          <div
            className={`search-response ${searchResult.complete ? "success" : "error"}`}
          >
            {searchResult.message}
          </div>
        )}
        <Keyboard ref={keyboardRef} />
      </div>
    </div>
  );
};

export default DemoPage;
