import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import dealsData from "../data/deals.json";
import FlightSearch from "../components/FlightSearch";
import OSMMapView from "../components/OSMMapView";
import "./Home.css";

const Home = () => {
  const { wishlist, dispatch } = useWishlist();
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // "list" or "map"
  const [activeTab, setActiveTab] = useState("flights"); // "flights" or "hotels"

  // Combine all deals for demo; filter as needed
  const allDeals = Object.values(dealsData).flat();
  const filteredDeals = allDeals.filter(deal =>
    deal.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleWishlist = (deal) => {
    const isInWishlist = wishlist.some((item) => item.id === deal.id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: deal.id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: deal });
    }
  };

  return (
    <div className="home">
      {/* Header with Logo and Navigation */}
      <div className="skyscanner-header">
        <div className="logo-bar">
          <h1 className="logo">TRIPTREK</h1>
        </div>
        <div className="auth-controls">
          <button className="help-btn">Help</button>
          <button className="language-btn">English (US)</button>
          <button className="currency-btn">C$ CAD</button>
          <button className="wishlist-btn">❤️</button>
          <button className="login-btn">Log in</button>
        </div>
      </div>

      {/* Main Navigation Tabs - Car Rental removed */}
      <div className="main-navigation">
        <div className={`nav-tab ${activeTab === "flights" ? "active" : ""}`} 
             onClick={() => setActiveTab("flights")}>
          <span className="nav-icon">✈️</span> Flights
        </div>
        <div className={`nav-tab ${activeTab === "hotels" ? "active" : ""}`}
             onClick={() => setActiveTab("hotels")}>
          <span className="nav-icon">🏨</span> Hotels
        </div>
      </div>

      {/* Hero Section with Background */}
      <div className="hero-section">
        <h1 className="hero-title">
          {activeTab === "flights" 
            ? "The best flight deals from anywhere, to everywhere" 
            : "Find the right hotel today"}
        </h1>

        {/* Flight Search Feature */}
        {activeTab === "flights" && (
          <section className="flight-search-section">
            <FlightSearch />
          </section>
        )}

        {/* Hotel Search Feature */}
        {activeTab === "hotels" && (
          <div className="hotel-search-container">
            <div className="search-fields">
              <div className="search-field destination">
                <label>Where would you like to stay?</label>
                <input 
                  type="text" 
                  placeholder="Enter destination or hotel name"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="search-field">
                <label>Check-in</label>
                <input type="text" placeholder="5/24/25" />
              </div>
              <div className="search-field">
                <label>Check-out</label>
                <input type="text" placeholder="5/31/25" />
              </div>
              <div className="search-field">
                <label>Guests and rooms</label>
                <input type="text" placeholder="1 adult, 1 room" />
              </div>
            </div>
            <button className="search-btn">Search hotels</button>
          </div>
        )}
      </div>

      {/* Tabs for List/Map */}
      <div className="view-toggle">
        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
        <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Map</button>
      </div>

      {/* Conditional Rendering */}
      {view === "list" ? (
        <section className="deals">
          <div className="deals-grid">
            {filteredDeals.map((deal) => {
              const isInWishlist = wishlist.some((item) => item.id === deal.id);
              return (
                <div key={deal.id} className="deal-card">
                  <img src={deal.image} alt={deal.city} className="deal-image" />
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
      ) : (
        <div className="map-list-container" style={{ display: "flex", gap: "2rem" }}>
          <div style={{ flex: 1 }}>
            <OSMMapView destinations={filteredDeals} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;