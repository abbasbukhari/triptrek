import React from "react";
import WishlistComponent from "../components/Wishlist";

const Wishlist = ({ wishlist, onRemoveFromWishlist }) => {
  return (
    <div>
      <WishlistComponent wishlist={wishlist} onRemoveFromWishlist={onRemoveFromWishlist} />
    </div>
  );
};

export default Wishlist;