import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Admin.css';

/** Icon nhỏ dạng line cho sidebar. */
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  books: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  ),
};

/** Khung chung cho mọi trang admin: sidebar điều hướng + vùng nội dung (Outlet). */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.fullName?.split(' ')[0] || user?.email;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v16H5.5A1.5 1.5 0 0 0 4 20.5V4.5Z" stroke="#9b9bff" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H13v16h5.5a1.5 1.5 0 0 1 1.5 1.5V4.5Z" stroke="#9b9bff" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <span>
            The Literary Gallery
            <small>Admin</small>
          </span>
        </Link>

        <nav className="admin-sidenav">
          <NavLink to="/admin" end>
            {icons.dashboard} Tổng quan
          </NavLink>
          <NavLink to="/admin/books">
            {icons.books} Quản lý sách
          </NavLink>
          <NavLink to="/admin/users">
            {icons.users} Quản lý người dùng
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-back-home">
            {icons.back} Về cửa hàng
          </Link>
          <div className="admin-user-chip">
            <div className="admin-user-meta">
              <span className="admin-user-name">{firstName}</span>
              <span className="admin-user-role">Quản trị viên</span>
            </div>
            <button type="button" className="admin-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
