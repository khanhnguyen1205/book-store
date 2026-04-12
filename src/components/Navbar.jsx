import React from 'react';
import SearchBar from './SearchBar';

export default function Navbar({ 
  search, 
  onSearchChange, 
  user, 
  cartItemCount, 
  onLoginClick, 
  onLogoutClick, 
  onCartClick 
}) {
  return (
    <nav className="lg-nav">
      <div className="lg-logo">The Literary Gallery</div>
      <div className="lg-nav-links">
        <span className="active">Browse</span>
        <span>New Arrivals</span>
        <span>Curated Collections</span>
      </div>
      <div className="lg-nav-right">
        <SearchBar value={search} onChange={onSearchChange} />
        {user ? (
          <span style={{ fontSize: 13, color: "#666", cursor: "pointer" }} onClick={onLogoutClick}>Sign Out</span>
        ) : (
          <span style={{ fontSize: 13, color: "#666", cursor: "pointer" }} onClick={onLoginClick}>Sign In</span>
        )}
        <div className="lg-cart" onClick={onCartClick} style={{ cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h1.5l1 7h7l1-5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7" cy="13" r="1" fill="white" />
            <circle cx="11" cy="13" r="1" fill="white" />
          </svg>
          {cartItemCount > 0 && <div className="lg-cart-badge">{cartItemCount}</div>}
        </div>
      </div>
    </nav>
  );
}
