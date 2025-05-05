import React, { useState, useEffect } from "react";
import DestinationCard from "../components/DestinationCard";
import destinationsData from "../data/destinations.json";

const Home = ({ onAddToWishlist }) => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    setDestinations(destinationsData);
  }, []);

  return (
    <div>
      <h1>Explore Destinations</h1>
      <div>
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;