import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    navigate('/login');
  };

  // Don't render the navbar on login page
  if (window.location.pathname === '/login') {
    return null;
  }

  return (
    <div className="navbar-container">
      {/* Top navigation with Home and Wishlist */}
      <div className="top-nav">
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/wishlist" className="nav-link">Wishlist</Link>
        </div>
      </div>

      {/* Main header with logo and auth controls */}
      <div className="main-header">
        <div className="logo-section">
          <Link to="/" className="logo">TRIPTREK</Link>
        </div>
        <div className="auth-controls">
          <button className="utility-btn">Help</button>
          <button className="utility-btn">English (US)</button>
          <button className="utility-btn">C$ CAD</button>
          <Link to="/wishlist" className="heart-btn">❤️</Link>
          {loggedIn && (
            <button onClick={handleLogout} className="logout-btn">Log out</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;