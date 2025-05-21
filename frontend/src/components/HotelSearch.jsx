import React, { useState } from "react";
import "./HotelSearch.css";

// Popular cities for quick selection
const popularCities = [
  { name: "New York", country: "USA" },
  { name: "London", country: "UK" },
  { name: "Paris", country: "France" },
  { name: "Tokyo", country: "Japan" },
  { name: "Sydney", country: "Australia" },
  { name: "Rome", country: "Italy" },
  { name: "Barcelona", country: "Spain" },
  { name: "Dubai", country: "UAE" },
  { name: "Vancouver", country: "Canada" },
  { name: "Toronto", country: "Canada" },
];

// Preselected hotels for demonstration purposes
const popularHotels = [
  { name: "Marriott Downtown", city: "New York", country: "USA" },
  { name: "Hilton Garden Inn", city: "London", country: "UK" },
  { name: "Ritz-Carlton", city: "Paris", country: "France" },
  { name: "Four Seasons", city: "Tokyo", country: "Japan" },
  { name: "Park Hyatt", city: "Sydney", country: "Australia" },
  { name: "W Hotel", city: "Barcelona", country: "Spain" },
  { name: "Sheraton", city: "Toronto", country: "Canada" },
  { name: "Fairmont", city: "Vancouver", country: "Canada" },
  { name: "Grand Hyatt", city: "Dubai", country: "UAE" },
  { name: "Holiday Inn", city: "Rome", country: "Italy" },
];

// Mock API data for demonstration (simulating API response)
const mockHotelResults = {
  "New York": [
    {
      id: "ny001",
      name: "Marriott Downtown",
      location: "New York, USA",
      rating: 4.5,
      reviewCount: 2345,
      price: "$199",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "ny002",
      name: "The Plaza Hotel",
      location: "New York, USA",
      rating: 4.8,
      reviewCount: 3201,
      price: "$399",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    }
  ],
  "London": [
    {
      id: "ld001",
      name: "Hilton Garden Inn",
      location: "London, UK",
      rating: 4.3,
      reviewCount: 1987,
      price: "$189",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "ld002",
      name: "The Savoy",
      location: "London, UK",
      rating: 4.9,
      reviewCount: 3578,
      price: "$459",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
  ]
};

// For other cities that don't have specific data
const defaultHotels = [
  {
    id: "default001",
    name: "Grand Hotel",
    location: "City Center",
    rating: 4.2,
    reviewCount: 1245,
    price: "$159",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "default002",
    name: "Boutique Suites",
    location: "Downtown",
    rating: 4.4,
    reviewCount: 987,
    price: "$179",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  }
];

const HotelSearch = () => {
  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("5/24/25");
  const [checkout, setCheckout] = useState("5/31/25");
  const [guests, setGuests] = useState("1 adult, 1 room");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  
  const handleSelect = (name, city) => {
    setDestination(name);
    setShowSuggestions(false);
  };

  // Fetch hotel data from API (or use mock data)
  const fetchHotels = async (query) => {
    setLoading(true);
    setError("");
    
    try {
      // In a real implementation, this would be an actual API call
      // For demo purposes, we'll use the mock data and add a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if we have specific mock data for this city
      const cityName = query.split(',')[0].trim();
      
      // Try to find the city in our mock data
      if (mockHotelResults[cityName]) {
        return mockHotelResults[cityName];
      }
      
      // For hotels search, return specific hotel results
      const exactHotel = popularHotels.find(hotel => hotel.name === query);
      if (exactHotel) {
        const cityData = mockHotelResults[exactHotel.city] || defaultHotels;
        return cityData.filter(hotel => hotel.name.includes(exactHotel.name));
      }
      
      // If no specific data, return default hotels
      return defaultHotels;
      
    } catch (err) {
      throw new Error("Failed to fetch hotel data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!destination) {
      setError("Please enter a destination or select a hotel.");
      return;
    }
    
    setSearched(true);
    try {
      const hotelResults = await fetchHotels(destination);
      setResults(hotelResults);
      if (hotelResults.length === 0) {
        setError("No hotels found for this destination.");
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    }
  };
  
  return (
    <div className="hotel-search-container">
      <div className="search-fields">
        <div className="search-field destination">
          <label>Where would you like to stay?</label>
          <div className="destination-input-wrapper">
            <input 
              type="text" 
              placeholder="Enter destination or hotel name" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && (
              <div className="city-suggestions">
                <div className="suggestions-header">Popular Hotels</div>
                {popularHotels.map((hotel, index) => (
                  <div 
                    key={index} 
                    className="city-suggestion"
                    onClick={() => handleSelect(hotel.name, hotel.city)}
                  >
                    <span className="city-name">{hotel.name}</span>
                    <span className="city-country">{hotel.city}, {hotel.country}</span>
                  </div>
                ))}
                <div className="suggestions-header">Popular Cities</div>
                {popularCities.map((city, index) => (
                  <div 
                    key={`city-${index}`} 
                    className="city-suggestion"
                    onClick={() => handleSelect(city.name, "")}
                  >
                    <span className="city-name">{city.name}</span>
                    <span className="city-country">{city.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="search-field">
          <label>Check-in</label>
          <input 
            type="text" 
            placeholder="5/24/25" 
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </div>
        
        <div className="search-field">
          <label>Check-out</label>
          <input 
            type="text" 
            placeholder="5/31/25" 
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </div>
        
        <div className="search-field">
          <label>Guests and rooms</label>
          <input 
            type="text" 
            placeholder="1 adult, 1 room"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
      </div>
      
      <button className="search-btn" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search hotels"}
      </button>

      {error && <div className="error-message">{error}</div>}
      
      {searched && !loading && results.length > 0 && (
        <div className="hotel-results">
          <h2>Hotels in {destination}</h2>
          <div className="hotel-grid">
            {results.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <img src={hotel.image} alt={hotel.name} />
                </div>
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="location">{hotel.location}</p>
                  <div className="rating">
                    <span className="stars">{'★'.repeat(Math.floor(hotel.rating))}</span>
                    <span className="rating-number">{hotel.rating}</span>
                    <span className="review-count">({hotel.reviewCount} reviews)</span>
                  </div>
                  <div className="price-section">
                    <span className="price">{hotel.price}</span>
                    <span className="per-night">per night</span>
                  </div>
                  <button className="view-deal-btn">View Deal</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelSearch;