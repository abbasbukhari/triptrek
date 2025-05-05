import React from "react";
import styles from "./DestinationCard.module.css";

const DestinationCard = ({ destination, onAddToWishlist }) => {
  return (
    <div className={styles.card}>
      <h3>{destination.city}, {destination.country}</h3>
      <p>{destination.description}</p>
      <p><strong>Deal:</strong> {destination.deal}</p>
      <button onClick={() => onAddToWishlist(destination)}>Add to Wishlist</button>
    </div>
  );
};

export default DestinationCard;