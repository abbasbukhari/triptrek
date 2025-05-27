import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Wishlist from "./components/Wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchHistoryProvider } from "./context/SearchHistoryContext";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    // Check for token or other auth indicators
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <WishlistProvider>
        <SearchHistoryProvider>
          <Routes>
            {/* Default route - redirect based on login state */}
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/login"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login setLoggedIn={setLoggedIn} />
                )
              }
            />

            <Route
              path="/wishlist"
              element={
                loggedIn ? (
                  <Wishlist loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch all other routes and redirect to login if not logged in */}
            <Route
              path="*"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </SearchHistoryProvider>
      </WishlistProvider>
    </Router>
  );
}

export default App;