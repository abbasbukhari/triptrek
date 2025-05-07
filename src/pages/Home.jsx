import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import dealsData from "../data/deals.json";
import "./Home.css";

const Home = () => {
  const { wishlist, dispatch } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState("flights");
  const [searchQuery, setSearchQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const popularDestinations = [
    { id: 1, city: "Paris", country: "France", description: "The city of lights and love.", deal: "20% off flights" },
    { id: 2, city: "Tokyo", country: "Japan", description: "A bustling hub of culture and technology.", deal: "15% off hotels" },
    { id: 3, city: "New York", country: "USA", description: "The city that never sleeps.", deal: "10% off attractions" },
    { id: 4, city: "Sydney", country: "Australia", description: "A beautiful harbor city.", deal: "25% off tours" },
  ];

  const handleToggleWishlist = (destination) => {
    const isInWishlist = wishlist.some((item) => item.id === destination.id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: destination.id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: destination });
    }
  };

  const deals = dealsData[selectedCategory].filter((deal) =>
    deal.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Explore travel deals and create your wishlist.</h1>
        <div className="search-bar">
          <div>
            <button onClick={() => setSelectedCategory("flights")}>Flights</button>
            <button onClick={() => setSelectedCategory("stays")}>Stays</button>
            <button onClick={() => setSelectedCategory("cars")}>Cars</button>
            <button onClick={() => setSelectedCategory("flightHotels")}>Flight+Hotel</button>
          </div>
          <div className="search-inputs">
            <input
              type="text"
              placeholder="From?"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="text"
              placeholder="To?"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <input
              type="date"
              placeholder="Departure"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h3>Save when you compare</h3>
          <p>Find the best deals for your dream destinations.</p>
        </div>
        <div className="feature">
          <h3>Personalized Wishlist</h3>
          <p>Keep track of your favorite destinations.</p>
        </div>
        <div className="feature">
          <h3>Interactive Planning</h3>
          <p>Plan your trips with ease and inspiration.</p>
        </div>
      </section>


      {/* Deals Section */}
      <section className="deals">
        <h2>Hottest Deals for {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
        <div className="deals-grid">
          {deals.map((deal) => {
            const isInWishlist = wishlist.some((item) => item.id === deal.id);
            return (
              <div key={deal.id} className="deal-card">
                <h3>{deal.city}</h3>
                <p>{deal.deal}</p>
                <button onClick={() => handleToggleWishlist(deal)}>
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;