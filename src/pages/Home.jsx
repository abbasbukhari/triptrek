import React from "react";
import { useWishlist } from "../context/WishlistContext";
import "./Home.css";

const Home = () => {
  const { wishlist, dispatch } = useWishlist();

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

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Explore travel deals and create your wishlist.</h1>
        <div className="search-bar">
          <div>
            <button>Flights</button>
            <button>Stays</button>
            <button>Cars</button>
            <button>Flight+Hotel</button>
          </div>
          <div className="search-inputs">
            <input type="text" placeholder="From?" />
            <input type="text" placeholder="To?" />
            <input type="date" placeholder="Departure" />
            <input type="date" placeholder="Return" />
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

      {/* Travel Deals Section */}
      <section className="travel-deals">
        <h2>Popular Destinations</h2>
        <div className="deals-grid">
          {popularDestinations.map((destination) => {
            const isInWishlist = wishlist.some((item) => item.id === destination.id);
            return (
              <div key={destination.id} className="deal-card">
                <h3>{destination.city}</h3>
                <p>{destination.description}</p>
                <button onClick={() => handleToggleWishlist(destination)}>
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