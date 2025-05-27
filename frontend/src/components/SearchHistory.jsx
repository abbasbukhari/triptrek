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
        <button onClick={handleClearAll} className="clear-all-btn">Clear All</button>
      </div>
      <ul className="search-history-list">
        {searchHistory.map((search, index) => (
          <li key={index} className="search-history-item">
            <span onClick={() => handleSelectSearch(search)} className="search-term">
              {search}
            </span>
            <button 
              onClick={() => handleRemoveSearch(search)} 
              className="remove-search-btn"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;