import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from './bookService';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import BookCard from '../../components/BookCard';
import './BookList.css';

const HeroCover = () => (
  <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" width="200" height="260">
    <rect width="200" height="280" rx="4" fill="#0d1f2d" />
    <circle cx="100" cy="100" r="55" fill="none" stroke="#c8a030" strokeWidth="1" opacity="0.6" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="#c8a030" strokeWidth="0.5" opacity="0.4" />
    <circle cx="100" cy="80" r="18" fill="#e8c060" opacity="0.9" />
    <path d="M70 160 Q100 100 130 160 Q100 150 70 160Z" fill="#1a3a50" opacity="0.8" />
    <path d="M80 160 Q100 110 120 160" fill="none" stroke="#2a5a70" strokeWidth="2" />
    <ellipse cx="100" cy="165" rx="35" ry="8" fill="#1a2a3a" opacity="0.5" />
    <text x="100" y="230" textAnchor="middle" fontSize="7" fill="#8899aa" fontFamily="serif" letterSpacing="2">MCXLEE BEAURELY SAFE LLE DASCUE</text>
    <text x="100" y="248" textAnchor="middle" fontSize="10" fill="#aabbc0" fontFamily="serif" letterSpacing="1">SAFE FOR WORK</text>
  </svg>
);

const categoriesList = [
  { label: "All" },
  { label: "Programming" },
  { label: "Self-help" },
  { label: "Novel" },
];

const LIMIT = 6;

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          _page: page,
          _limit: LIMIT,
        };
        
        if (debouncedSearch) {
          params.q = debouncedSearch;
        }
        
        if (category !== 'All') {
          params.category = category;
        }
        
        if (sort === 'price_asc') {
          params._sort = 'price';
          params._order = 'asc';
        } else if (sort === 'price_desc') {
          params._sort = 'price';
          params._order = 'desc';
        }
        
        const res = await bookService.getBooks(params);
        setBooks(res.data);
        setTotalCount(res.totalCount);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [debouncedSearch, category, sort, page]);

  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  const handleCategoryClick = (catLabel) => {
    setCategory(catLabel);
    setPage(1);
  };

  return (
    <div className="lg-wrap">

      {/* Navbar */}
      <nav className="lg-nav">
        <div className="lg-logo">The Literary Gallery</div>
        <div className="lg-nav-links">
          <span className="active">Browse</span>
          <span>New Arrivals</span>
          <span>Curated Collections</span>
        </div>
        <div className="lg-nav-right">
          <div className="lg-search">
            <input 
              placeholder="Search for titles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {user ? (
            <span style={{ fontSize: 13, color: "#666", cursor: "pointer" }} onClick={() => { logout(); navigate("/login"); }}>Sign Out</span>
          ) : (
            <span style={{ fontSize: 13, color: "#666", cursor: "pointer" }} onClick={() => navigate("/login")}>Sign In</span>
          )}
          <div className="lg-cart" onClick={() => navigate("/cart")}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h1.5l1 7h7l1-5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="13" r="1" fill="white" />
              <circle cx="11" cy="13" r="1" fill="white" />
            </svg>
            {cart.length > 0 && <div className="lg-cart-badge">{cart.reduce((Sum, item) => Sum + item.quantity, 0)}</div>}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lg-hero">
        <div className="lg-hero-text">
          <div className="lg-hero-eyebrow">Editor's Choice</div>
          <h1 className="lg-hero-title">
            A Journey<br />Through<br /><em>Lost Archives</em>
          </h1>
          <p className="lg-hero-desc">
            Discover a curated collection of rare first editions and contemporary masterpieces in our latest seasonal archive.
          </p>
          <div className="lg-hero-btns">
            <button className="lg-btn-primary">Explore Collection</button>
            <button className="lg-btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="lg-hero-book-wrap">
          <div className="lg-hero-book-img">
            <HeroCover />
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="lg-main">
        {/* Sidebar */}
        <aside className="lg-sidebar">
          <h4>Categories</h4>
          <ul className="lg-cat-list">
            {categoriesList.map((cat) => (
              <li 
                key={cat.label} 
                className={category === cat.label ? "active" : ""}
                onClick={() => handleCategoryClick(cat.label)}
              >
                {cat.label}
              </li>
            ))}
          </ul>
          <h4>Filter by Price</h4>
          <input type="range" min="0" max="500" defaultValue="200" style={{ width: "100%", margin: "8px 0" }} />
          <div className="lg-price-label">
            <span>$0</span>
            <span>$500+</span>
          </div>
          <div className="lg-quote-card">
            <p>"A room without books is like a body without a soul."</p>
            <cite>— Marcus Cicero</cite>
          </div>
        </aside>

        {/* Book grid */}
        <div className="lg-content">
          <div className="lg-content-header">
            <h2 className="lg-section-title">Featured <em>New Arrivals</em></h2>
            <div className="lg-sort">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem 0', color: '#666' }}>Loading books...</div>
          ) : error ? (
            <div style={{ padding: '3rem 0', color: '#e24b4a' }}>{error}</div>
          ) : books.length === 0 ? (
            <div style={{ padding: '3rem 0', color: '#666' }}>No books found for your search.</div>
          ) : (
            <div className="lg-grid">
              {books.map((book) => (
                <div key={book.id} onClick={() => navigate(`/book/${book.id}`)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="lg-pagination">
              <div 
                className="lg-page-btn" 
                style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                ‹
              </div>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <div 
                    key={n} 
                    className={`lg-page-btn${n === page ? " active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </div>
                );
              })}
              <div 
                className="lg-page-btn" 
                style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                ›
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="lg-footer">
          <div>
            <div className="lg-footer-brand">The Literary Gallery</div>
            <p className="lg-footer-desc">
              Curation of the world's most evocative literature and visual narratives. We believe every shelf tells a story.
            </p>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li>Journal</li>
              <li>Collections</li>
              <li>Exhibitions</li>
              <li>Membership</li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Shipping &amp; Returns</li>
            </ul>
          </div>
          <div>
            <h5>The Atelier Newsletter</h5>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
              Subscribe for weekly curations and exclusive literary events.
            </p>
            <div className="lg-newsletter-input">
              <input placeholder="email@example.com" />
              <button className="lg-newsletter-btn">→</button>
            </div>
          </div>
        </div>
        <div className="lg-footer-bottom">
          <span>© 2024 The Literary Gallery. All rights reserved.</span>
          <div className="lg-footer-bottom-links">
            <span style={{ color: "#4444cc" }}>Journal</span>
            <span>Contact</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}