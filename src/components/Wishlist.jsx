import React from "react";
import styles from "./Wishlist.module.css";

const Wishlist = ({ wishlist, onRemoveFromWishlist }) => {
  return (
    <div className={styles.wishlist}>
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No destinations in your wishlist yet.</p>
      ) : (
        wishlist.map((destination) => (
          <div key={destination.id} className={styles.item}>
            <h3>{destination.city}, {destination.country}</h3>
            <button onClick={() => onRemoveFromWishlist(destination.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;