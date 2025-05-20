import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Wishlist from "./components/Wishlist";
import DestinationDetail from "./components/DestinationDetail";
import Login from "./components/Login";
import FlightSearch from "./components/FlightSearch";
import destinationsData from "./data/destinations.json";
import { WishlistProvider } from "./context/WishlistContext"; // <-- import your provider
import "./App.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // A wrapper for protected routes
  function RequireAuth({ children }) {
    let location = useLocation();
    if (!loggedIn) {
      // Redirect to /login, but save the current location
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  return (
    <WishlistProvider>
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/wishlist">Wishlist</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireAuth>
                <Wishlist />
              </RequireAuth>
            }
          />
          <Route
            path="/destination/:id"
            element={
              <RequireAuth>
                <DestinationDetail
                  destination={destinationsData.find(
                    (dest) => dest.id === parseInt(window.location.pathname.split("/").pop())
                  )}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/flights"
            element={
              <RequireAuth>
                <FlightSearch />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </WishlistProvider>
  );
};

export default App;