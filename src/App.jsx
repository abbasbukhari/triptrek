import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import "./App.css";

const App = () => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (destination) => {
    if (!wishlist.find((item) => item.id === destination.id)) {
      setWishlist([...wishlist, destination]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home onAddToWishlist={addToWishlist} />} />
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} onRemoveFromWishlist={removeFromWishlist} />}
        />
      </Routes>
    </Router>
  );
};

export default App;