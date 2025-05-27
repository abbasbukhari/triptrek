// code for search history context
import React, { createContext, useReducer, useContext } from "react";

// Create the context
const SearchHistoryContext = createContext();

// Initial state
const initialState = [];

const ADD_TO_HISTORY = "ADD_TO_HISTORY";
const CLEAR_HISTORY = "CLEAR_HISTORY";
const REMOVE_FROM_HISTORY = "REMOVE_FROM_HISTORY";

// Reducer function
const searchHistoryReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_HISTORY:
      // Prevent duplicates and limit to 10 recent searches
      if (!state.includes(action.payload)) {
        return [action.payload, ...state].slice(0, 10);
      }
      return state;
    case REMOVE_FROM_HISTORY:
      return state.filter(term => term !== action.payload);
    case CLEAR_HISTORY:
      return [];
    default:
      return state;
  }
};

// Custom provider component
export const SearchHistoryProvider = ({ children }) => {
  const [searchHistory, dispatch] = useReducer(searchHistoryReducer, initialState);

  return (
    <SearchHistoryContext.Provider value={{ searchHistory, dispatch }}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

// Custom hook for using the context
export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error("useSearchHistory must be used within a SearchHistoryProvider");
  }
  return context;
};