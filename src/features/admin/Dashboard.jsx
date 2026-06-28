import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from './adminService';
import './Admin.css';

/** Trang tổng quan admin: thống kê nhanh + điều hướng sang 2 trang quản lý. */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [books, users] = await Promise.all([
          adminService.getBooks(),
          adminService.getUsers(),
        ]);
        if (!active) return;
        setStats({
          books: books.length,
          users: users.length,
          stock: books.reduce((s, b) => s + (Number(b.stock) || 0), 0),
          sold: books.reduce((s, b) => s + (Number(b.sold) || 0), 0),
        });
      } catch {
        if (active) setError('Không tải được dữ liệu. Kiểm tra JSON Server (cổng 9999).');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Bảng điều khiển</h1>
          <p className="admin-subtitle">Tổng quan cửa hàng The Literary Gallery</p>
        </div>
      </div>

      {error && <p className="admin-feedback error">{error}</p>}

      <div className="admin-stats">
        <div className="stat-card">
          <p className="stat-label">Tổng số sách</p>
          <p className="stat-value">{stats ? stats.books : '—'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Người dùng</p>
          <p className="stat-value">{stats ? stats.users : '—'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Tồn kho</p>
          <p className="stat-value">{stats ? stats.stock.toLocaleString() : '—'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Đã bán</p>
          <p className="stat-value">{stats ? stats.sold.toLocaleString() : '—'}</p>
        </div>
      </div>

      <h2 className="admin-section-title">Lối tắt</h2>
      <div className="admin-nav-cards">
        <Link className="nav-card" to="/admin/books">
          <span className="nav-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <div>
            <h3>Quản lý sách</h3>
            <p>Thêm, sửa, xoá sách trong cửa hàng.</p>
          </div>
        </Link>
        <Link className="nav-card" to="/admin/users">
          <span className="nav-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <div>
            <h3>Quản lý người dùng</h3>
            <p>Phân quyền và xoá tài khoản người dùng.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
