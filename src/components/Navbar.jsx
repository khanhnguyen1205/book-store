import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import SearchBar from './SearchBar';
import './Navbar.css';

export default function Navbar({ search, onSearchChange }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    navigate(user ? '/cart' : '/login');
  };

  const handleAuthClick = () => {
    if (user) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="lg-nav">
      <Link to="/" className="lg-logo">The Literary Gallery</Link>
      <div className="lg-nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </div>
      <div className="lg-nav-right">
        {onSearchChange && (
          <SearchBar value={search || ''} onChange={onSearchChange} />
        )}
        <span className="lg-nav-auth" onClick={handleAuthClick}>
          {user ? 'Sign Out' : 'Sign In'}
        </span>
        <div className="lg-cart" onClick={handleCartClick}>
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
