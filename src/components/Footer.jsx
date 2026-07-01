import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Footer.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();

    if (!emailRegex.test(value)) {
      setStatus('error');
      setMessage('Vui lòng nhập email hợp lệ.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      // Chặn đăng ký trùng: kiểm tra trước rồi mới ghi.
      const { data: existing } = await api.get(`/subscribers?email=${value}`);
      if (existing.length > 0) {
        setStatus('error');
        setMessage('Email này đã đăng ký rồi.');
        return;
      }
      await api.post('/subscribers', { email: value, createdAt: new Date().toISOString() });
      setStatus('success');
      setMessage('Cảm ơn bạn đã đăng ký nhận bản tin!');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Không kết nối được máy chủ. Thử lại sau.');
    }
  };

  return (
    <footer>
      <div className="lg-footer">
        <div>
          <div className="lg-footer-brand">The Literary Gallery</div>
          <p className="lg-footer-desc">
            Curation of the world's most evocative literature and visual narratives. We believe every shelf tells a story.
          </p>
          <div className="lg-footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h5>Cửa hàng</h5>
          <ul>
            <li><Link className="lg-footer-link" to="/">Trang chủ</Link></li>
            <li><Link className="lg-footer-link" to="/cart">Giỏ hàng</Link></li>
            <li><Link className="lg-footer-link" to="/profile">Tài khoản</Link></li>
          </ul>
        </div>

        <div>
          <h5>Thông tin</h5>
          <ul>
            <li><Link className="lg-footer-link" to="/about">Về chúng tôi</Link></li>
            <li><Link className="lg-footer-link" to="/contact">Liên hệ</Link></li>
            <li><Link className="lg-footer-link" to="/privacy">Chính sách bảo mật</Link></li>
            <li><Link className="lg-footer-link" to="/terms">Điều khoản dịch vụ</Link></li>
          </ul>
        </div>

        <div>
          <h5>The Atelier Newsletter</h5>
          <p style={{ fontSize: 13, color: 'var(--paper-dim)', lineHeight: 1.5 }}>
            Subscribe for weekly curations and exclusive literary events.
          </p>
          <form className="lg-newsletter-input" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email nhận bản tin"
            />
            <button
              type="submit"
              className="lg-newsletter-btn"
              disabled={status === 'loading'}
              aria-label="Đăng ký nhận bản tin"
            >
              {status === 'loading' ? '…' : '→'}
            </button>
          </form>
          {message && (
            <p className={`lg-newsletter-msg ${status === 'success' ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="lg-footer-bottom">
        <span>© {new Date().getFullYear()} The Literary Gallery. All rights reserved.</span>
        <div className="lg-footer-bottom-links">
          <Link to="/about">Về chúng tôi</Link>
          <Link to="/contact">Liên hệ</Link>
          <Link to="/privacy">Bảo mật</Link>
          <Link to="/terms">Điều khoản</Link>
        </div>
      </div>
    </footer>
  );
}
