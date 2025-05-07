import React from "react";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlist, dispatch } = useWishlist();

  const handleRemoveFromWishlist = (id) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  };

  return (
    <div className="wishlist">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No destinations in your wishlist yet.</p>
      ) : (
        wishlist.map((destination) => (
          <div key={destination.id} className="wishlist-item">
            <h3>{destination.city}, {destination.country}</h3>
            <button onClick={() => handleRemoveFromWishlist(destination.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;