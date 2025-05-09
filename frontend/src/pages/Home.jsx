import React, { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import dealsData from "../data/deals.json";
import "./Home.css";

const Home = () => {
  const { wishlist, dispatch } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState("flights");
  const [from, setFrom] = useState("Canada");
  const [to, setTo] = useState("France");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleToggleWishlist = (deal) => {
    const isInWishlist = wishlist.some((item) => item.id === deal.id);
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: deal.id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: deal });
    }
  };

  const handleSearch = () => {
    if (selectedCategory === "flights") {
      const results = dealsData.flights.filter((deal) => {
        const matchesFrom = from ? deal.from?.toLowerCase() === from.toLowerCase() : true;
        const matchesTo = to ? deal.to?.toLowerCase() === to.toLowerCase() : true;
        return matchesFrom && matchesTo;
      });
      setSearchResults(results);
    }
  };

  const deals = dealsData[selectedCategory];

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
          {selectedCategory === "flights" && (
            <div className="search-inputs">
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Australia">Australia</option>
              </select>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                <option value="France">France</option>
                <option value="USA">USA</option>
                <option value="Japan">Japan</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
              </select>
              <input
                type="date"
                placeholder="Departure"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
              <input
                type="date"
                placeholder="Return"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
            </div>
          )}
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

      {/* Search Results Section */}
      {selectedCategory === "flights" && searchResults.length > 0 && (
        <section className="search-results">
          <h2>Search Results</h2>
          <div className="deals-grid">
            {searchResults.map((result) => {
              const isInWishlist = wishlist.some((item) => item.id === result.id);
              return (
                <div key={result.id} className="deal-card">
                  <h3>{result.city}</h3>
                  <p>{result.deal}</p>
                  <button onClick={() => handleToggleWishlist(result)}>
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;