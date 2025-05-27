import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="header-container">
      <div className="header-top">
        <div className="header-links">
          <Link to="/" className="header-link">Home</Link>
          <Link to="/wishlist" className="header-link">Wishlist</Link>
        </div>
      </div>
      
      <div className="header-main">
        <Link to="/" className="header-logo">TRIPTREK</Link>
        
        <div className="header-controls">
          <button className="header-utility-btn">Help</button>
          <button className="header-utility-btn">English (US)</button>
          <button className="header-utility-btn">C$ CAD</button>
          <Link to="/wishlist" className="header-heart-btn">❤️</Link>
          {loggedIn && (
            <button onClick={handleLogout} className="header-logout-btn">Log out</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;