import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useSearchHistory } from "../context/SearchHistoryContext";
import dealsData from "../data/deals.json";
import FlightSearch from "../components/FlightSearch";
import HotelSearch from "../components/HotelSearch";
import OSMMapView from "../components/OSMMapView";
import SearchHistory from "../components/SearchHistory";
import TravelBundle from "../components/TravelBundle";
import "./Home.css";

const Home = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const { wishlist, dispatch } = useWishlist();
  const { dispatch: searchDispatch } = useSearchHistory();
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [view, setView] = useState("list"); // "list" or "map"
  const [activeTab, setActiveTab] = useState("flights"); // "flights" or "hotels" or "bundles"
  const [mapCenter, setMapCenter] = useState([45.4215, -75.6972]);
  const [mapZoom, setMapZoom] = useState(2);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [tripDuration, setTripDuration] = useState(3); // Default to 3 nights

  // Combine all deals for demo; filter as needed
  const allDeals = Object.values(dealsData).flat();
  const filteredDeals = allDeals.filter((deal) =>
    deal.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    navigate('/login');
  };

  const handleSearch = () => {
    if (search.trim()) {
      // Add search term to history when search is executed
      searchDispatch({ type: "ADD_TO_HISTORY", payload: search.trim() });

      if (filteredDeals.length > 0) {
        const firstResult = filteredDeals[0];
        if (firstResult.lat && firstResult.lng) {
          setMapCenter([firstResult.lat, firstResult.lng]);
          setMapZoom(6); // Zoom in when searching
          setView("map"); // Switch to map view
        }
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setMapZoom(2); // Reset zoom when clearing search
    }
  };

  const handleSelectSearch = (searchTerm) => {
    setSearch(searchTerm);
    // Trigger search after selecting from history
    setTimeout(() => {
      if (filteredDeals.length > 0) {
        const firstResult = filteredDeals[0];
        if (firstResult.lat && firstResult.lng) {
          setMapCenter([firstResult.lat, firstResult.lng]);
          setMapZoom(6);
          setView("map");
        }
      }
    }, 0);
  };

  const handleToggleWishlist = (deal) => {
    const isInWishlist = wishlist.some((item) => item.id === deal.id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: deal.id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: deal });
    }
  };

  // Add a handler for selecting flights
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    if (activeTab === "flights") {
      setActiveTab("hotels"); // Move to hotels after selecting a flight
    }
  };

  // Add a handler for selecting hotels
  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    if (activeTab === "hotels" && selectedFlight) {
      setActiveTab("bundles"); // Move to bundles after selecting a hotel
    }
  };

  return (
    <div className="home">
      {/* Custom Header */}
      <div className="custom-header">
        <div className="top-bar">
          <div className="top-links">
            <Link to="/" className="top-link">Home</Link>
            <Link to="/wishlist" className="top-link">Wishlist</Link>
          </div>
        </div>

        <div className="main-bar">
          <Link to="/" className="site-logo">TRIPTREK</Link>
          <div className="right-controls">
            <button className="utility-button">Help</button>
            <button className="utility-button">English (US)</button>
            <button className="utility-button">C$ CAD</button>
            <Link to="/wishlist" className="wishlist-heart">❤️</Link>
            {loggedIn && (
              <button onClick={handleLogout} className="logout-button">Log out</button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="main-navigation">
        <div
          className={`nav-tab ${activeTab === "flights" ? "active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          <span className="nav-icon">✈️</span> Flights
        </div>
        <div
          className={`nav-tab ${activeTab === "hotels" ? "active" : ""}`}
          onClick={() => setActiveTab("hotels")}
        >
          <span className="nav-icon">🏨</span> Hotels
        </div>
        <div
          className={`nav-tab ${activeTab === "bundles" ? "active" : ""}`}
          onClick={() => setActiveTab("bundles")}
        >
          <span className="nav-icon">🎁</span> Bundles
        </div>
      </div>

      {/* Hero Section with Background */}
      <div className="hero-section">
        <h1 className="hero-title">
          {activeTab === "flights"
            ? "The best flight deals from anywhere, to everywhere"
            : activeTab === "hotels"
            ? "Find the right hotel today"
            : "Save with our Flight + Hotel bundles"}
        </h1>

        {/* Flight Search Feature */}
        {activeTab === "flights" && (
          <section className="flight-search-section">
            <FlightSearch onSelectFlight={handleSelectFlight} />
          </section>
        )}

        {/* Hotel Search Feature */}
        {activeTab === "hotels" && (
          <section className="hotel-search-section">
            <HotelSearch onSelectHotel={handleSelectHotel} />
          </section>
        )}

        {/* Bundle Feature */}
        {activeTab === "bundles" && (
          <section className="bundle-section">
            <div className="duration-selector">
              <label>
                Stay duration:
                <select
                  value={tripDuration}
                  onChange={(e) => setTripDuration(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((days) => (
                    <option key={days} value={days}>
                      {days} {days === 1 ? "night" : "nights"}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <TravelBundle
              selectedFlight={selectedFlight}
              selectedHotel={selectedHotel}
              duration={tripDuration}
            />

            {(!selectedFlight || !selectedHotel) && (
              <div className="bundle-placeholder">
                <p>Please select a flight and hotel to view bundle options.</p>
                {!selectedFlight && (
                  <button
                    onClick={() => setActiveTab("flights")}
                    className="select-btn"
                  >
                    Select a Flight
                  </button>
                )}
                {selectedFlight && !selectedHotel && (
                  <button
                    onClick={() => setActiveTab("hotels")}
                    className="select-btn"
                  >
                    Select a Hotel
                  </button>
                )}
              </div>
            )}
          </section>
        )}
      </div>

      {/* New Large Search Bar for Destinations with Search History */}
      <header className="header">
        <div className="search-bar-large" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowHistory(true)}
            onBlur={(e) => {
              // Delay hiding to allow clicking on search history items
              setTimeout(() => setShowHistory(false), 200);
            }}
          />
          <button className="large-search-btn" onClick={handleSearch}>
            <span role="img" aria-label="search">
              🔍
            </span>{" "}
            Search
          </button>
          <SearchHistory
            onSelectSearch={handleSelectSearch}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
          />
        </div>
      </header>

      {/* Tabs for List/Map */}
      <div className="view-toggle">
        <button
          className={view === "list" ? "active" : ""}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={view === "map" ? "active" : ""}
          onClick={() => setView("map")}
        >
          Map
        </button>
      </div>

      {/* Conditional Rendering */}
      {view === "list" ? (
        <section className="deals">
          <div className="deals-grid">
            {filteredDeals.map((deal) => {
              const isInWishlist = wishlist.some((item) => item.id === deal.id);
              return (
                <div key={deal.id} className="deal-card">
                  <img
                    src={deal.image}
                    alt={deal.city}
                    className="deal-image"
                  />
                  <h3>{deal.city}</h3>
                  <p>{deal.deal}</p>
                  <button onClick={() => handleToggleWishlist(deal)}>
                    {isInWishlist
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div
          className="map-list-container"
          style={{ display: "flex", gap: "2rem" }}
        >
          <div style={{ flex: 1 }}>
            {/* Updated OSMMapView component with new props */}
            <OSMMapView
              destinations={filteredDeals}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;