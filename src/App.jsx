import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Wishlist from "./components/Wishlist";
import DestinationDetail from "./components/DestinationDetail";
import destinationsData from "./data/destinations.json";
import "./App.css";

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/destination/:id"
          element={
            <DestinationDetail
              destination={destinationsData.find(
                (dest) => dest.id === parseInt(window.location.pathname.split("/").pop())
              )}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;