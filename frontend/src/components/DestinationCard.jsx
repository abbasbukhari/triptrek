import React from "react";
import { useWishlist } from "../context/WishlistContext";

const DestinationCard = ({ destination }) => {
  const { wishlist, dispatch } = useWishlist();

  const isInWishlist = wishlist.some((item) => item.id === destination.id);

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: destination.id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: destination });
    }
  };

  return (
    <div className="destination-card">
      <h3>{destination.city}, {destination.country}</h3>
      <p>{destination.description}</p>
      <p><strong>Deal:</strong> {destination.deal}</p>
      <button onClick={handleToggleWishlist}>
        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
};

export default DestinationCard;