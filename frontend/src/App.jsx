import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Wishlist from "./components/Wishlist";
import DestinationDetail from "./components/DestinationDetail";
import Login from "./components/Login";
import destinationsData from "./data/destinations.json";
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
      </Routes>
    </Router>
  );
};

export default App;