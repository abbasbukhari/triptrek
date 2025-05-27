import React from "react";
import { useSearchHistory } from "../context/SearchHistoryContext";
import "./SearchHistory.css";

const SearchHistory = ({ onSelectSearch, showHistory, setShowHistory }) => {
  const { searchHistory, dispatch } = useSearchHistory();

  const handleSelectSearch = (searchTerm) => {
    onSelectSearch(searchTerm);
    setShowHistory(false);
  };

  const handleRemoveSearch = (searchTerm) => {
    dispatch({ type: "REMOVE_FROM_HISTORY", payload: searchTerm });
  };

  const handleClearAll = () => {
    dispatch({ type: "CLEAR_HISTORY" });
  };

  if (!showHistory || searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="search-history">
      <div className="search-history-header">
        <h4>Recent Searches</h4>
        <button className="clear-all-btn" onClick={handleClearAll}>
          Clear All
        </button>
      </div>
      <div className="search-history-list">
        {searchHistory.map((term, index) => (
          <div key={index} className="search-history-item">
            <span
              className="search-term"
              onClick={() => handleSelectSearch(term)}
            >
              {term}
            </span>
            <button
              className="remove-search-btn"
              onClick={() => handleRemoveSearch(term)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;