import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import "./Wishlist.css";

const Wishlist = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const { wishlist, dispatch } = useWishlist();

  const handleRemoveFromWishlist = (id) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      {/* Custom Header - same as Home */}
      <div className="custom-header">
        <div className="top-bar">
          <div className="top-links">
            <Link to="/" className="top-link">Home</Link>
            <Link to="/wishlist" className="top-link">Wishlist</Link>
          </div>
        </div>

        <div className="main-bar">
          <Link to="/" className="site-logo">TRIPTREK</Link>
          <div className="right-controls">
            <button className="utility-button">Help</button>
            <button className="utility-button">English (US)</button>
            <button className="utility-button">C$ CAD</button>
            <Link to="/wishlist" className="wishlist-heart">❤️</Link>
            {loggedIn && (
              <button onClick={handleLogout} className="logout-button">Log out</button>
            )}
          </div>
        </div>
      </div>
      
      <div className="wishlist">
        <h2>Your Wishlist</h2>
        
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <p>No destinations in your wishlist yet.</p>
            <p>Explore destinations and add ones you like to your wishlist!</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                {item.image && (
                  <div className="wishlist-item-image">
                    <img src={item.image} alt={`${item.city}, ${item.country}`} />
                  </div>
                )}
                <div className="wishlist-item-content">
                  <h3>{item.city}, {item.country}</h3>
                  {item.description && <p>{item.description}</p>}
                  {item.deal && <p><strong>Deal:</strong> {item.deal}</p>}
                  <button onClick={() => handleRemoveFromWishlist(item.id)}>
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;