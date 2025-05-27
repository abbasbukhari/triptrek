// code for search history context
import React, { createContext, useReducer, useContext, useEffect } from "react";

const ADD_TO_HISTORY = "ADD_TO_HISTORY";
const CLEAR_HISTORY = "CLEAR_HISTORY";
const REMOVE_FROM_HISTORY = "REMOVE_FROM_HISTORY";

const searchHistoryReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_HISTORY:
      // Prevent adding empty or duplicate searches
      if (!action.payload || state.includes(action.payload)) {
        return state;
      }
      // Keeps only last 10 searches
      const newHistory = [action.payload, ...state].slice(0, 10);
      return newHistory;
    case REMOVE_FROM_HISTORY:
      return state.filter(item => item !== action.payload);
    case CLEAR_HISTORY:
      return [];
    default:
      return state;
  }
};

const SearchHistoryContext = createContext();

export const SearchHistoryProvider = ({ children }) => {
  const [searchHistory, dispatch] = useReducer(searchHistoryReducer, [], () => {
    const savedHistory = localStorage.getItem("searchHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  return (
    <SearchHistoryContext.Provider value={{ searchHistory, dispatch }}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error("useSearchHistory must be used within a SearchHistoryProvider");
  }
  return context;
};