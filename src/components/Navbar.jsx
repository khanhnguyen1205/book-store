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

  const firstName = user?.fullName?.split(' ')[0] || user?.email;

  return (
    <nav className="lg-nav">
      <Link to="/" className="lg-logo">
        <svg className="lg-logo-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v16H5.5A1.5 1.5 0 0 0 4 20.5V4.5Z" stroke="#3333bb" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H13v16h5.5a1.5 1.5 0 0 1 1.5 1.5V4.5Z" stroke="#3333bb" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span>The Literary Gallery</span>
      </Link>
      <div className="lg-nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/cart">Cart</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      </div>
      <div className="lg-nav-right">
        {onSearchChange && (
          <SearchBar value={search || ''} onChange={onSearchChange} />
        )}
        <div className="lg-cart" onClick={handleCartClick} title="Cart">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h1.5l1 7h7l1-5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7" cy="13" r="1" fill="white" />
            <circle cx="11" cy="13" r="1" fill="white" />
          </svg>
          {cartItemCount > 0 && <div className="lg-cart-badge">{cartItemCount}</div>}
        </div>
        {user && (
          <button
            type="button"
            className="lg-nav-greeting"
            onClick={() => navigate('/profile')}
            title="Manage your account"
          >
            Hi, {firstName}
          </button>
        )}
        <button className="lg-nav-auth" onClick={handleAuthClick}>
          {user ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </nav>
  );
}
