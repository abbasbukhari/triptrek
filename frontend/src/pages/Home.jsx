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

  // improved search handling
  const [mapCenter, setMapCenter] = useState([45.4215, -75.6972]);
const [mapZoom, setMapZoom] = useState(2);

  // Combine all deals for demo; filter as needed
  const allDeals = Object.values(dealsData).flat();
  const filteredDeals = allDeals.filter(deal =>
    deal.city.toLowerCase().includes(search.toLowerCase())
  );

  // Modify the search handling
const handleSearch = () => {
  if (filteredDeals.length > 0) {
    const firstResult = filteredDeals[0];
    if (firstResult.lat && firstResult.lng) {
      setMapCenter([firstResult.lat, firstResult.lng]);
      setMapZoom(6); // Zoom in when searching
      setView("map"); // Switch to map view
    }
  }
};

// Update the search input's onChange to reset zoom when clearing
const handleSearchChange = (e) => {
  setSearch(e.target.value);
  if (e.target.value === "") {
    setMapZoom(2); // Reset zoom when clearing search
  }
};

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
      {/* Move logo to the very top */}
      <div className="logo-bar">
        <h1 className="logo">TRIPTREK</h1>
      </div>

      {/* Flight Search Feature */}
      <section className="flight-search-section">
        <FlightSearch />
      </section>

      {/* Large Search Bar */}
      <header className="header">
        <div className="search-bar-large">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="large-search-btn">
            <span role="img" aria-label="search">🔍</span> Search
          </button>
        </div>
      </header>

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