import React from "react";
import "./Home.css";

const Home = ({ onAddToWishlist }) => {
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
          <div className="deal-card">Paris</div>
          <div className="deal-card">Tokyo</div>
          <div className="deal-card">New York</div>
          <div className="deal-card">Sydney</div>
        </div>
      </section>
    </div>
  );
};

export default Home;