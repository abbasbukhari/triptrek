import React from "react";
import { useWishlist } from "../context/WishlistContext";
import "./Wishlist.module.css";

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
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-item">
              <h3>{item.city}, {item.country}</h3>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Deal:</strong> {item.deal}</p>
              <button onClick={() => handleRemoveFromWishlist(item.id)}>
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;