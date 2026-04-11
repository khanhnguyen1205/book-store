import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "./bookService";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import "./BookDetail.css";

const RelatedCover1 = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#2a2a3a" />
        <ellipse cx="100" cy="90" rx="50" ry="60" fill="#3a3a50" />
        <ellipse cx="100" cy="70" rx="35" ry="40" fill="#4a4060" />
        <circle cx="100" cy="60" r="20" fill="#5a5070" />
        <ellipse cx="95" cy="58" rx="6" ry="8" fill="#c08030" opacity="0.8" />
        <ellipse cx="108" cy="58" rx="6" ry="8" fill="#c08030" opacity="0.8" />
    </svg>
);

const RelatedCover2 = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#1a0f05" />
        <rect x="20" y="30" width="160" height="140" fill="#2a1a08" rx="2" />
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <rect key={i} x={28 + i * 20} y="40" width="14" height="110" fill={`hsl(30,${40 + i * 5}%,${18 + i * 3}%)`} rx="1" />
        ))}
        <rect x="20" y="130" width="160" height="10" fill="#0a0805" opacity="0.6" />
        <circle cx="100" cy="160" r="12" fill="#c8a030" opacity="0.9" />
        <rect x="60" y="155" width="80" height="30" fill="#0f0a05" rx="2" />
        <line x1="40" y1="158" x2="160" y2="158" stroke="#3a2a10" strokeWidth="1" />
    </svg>
);

const RelatedCover3 = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0f1520" />
        <defs>
            <pattern id="rain" width="10" height="20" patternUnits="userSpaceOnUse">
                <line x1="5" y1="0" x2="3" y2="20" stroke="#6688aa" strokeWidth="0.5" opacity="0.5" />
            </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#rain)" opacity="0.3" />
        <ellipse cx="100" cy="100" rx="45" ry="60" fill="#1a2535" />
        <ellipse cx="100" cy="80" rx="28" ry="32" fill="#253040" />
        <path d="M75 75 Q100 55 125 75 Q110 90 100 88 Q90 90 75 75Z" fill="#304050" />
    </svg>
);

const RelatedCover4 = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#0d0d18" />
        <circle cx="100" cy="40" r="30" fill="#1a1a2e" />
        <ellipse cx="100" cy="38" rx="18" ry="20" fill="#252538" />
        <path d="M70 80 Q100 65 130 80 L135 160 Q100 170 65 160Z" fill="#1a1a2e" />
        <rect x="80" y="78" width="40" height="50" fill="#252538" />
        <line x1="85" y1="78" x2="85" y2="128" stroke="#0d0d18" strokeWidth="1" />
        <line x1="115" y1="78" x2="115" y2="128" stroke="#0d0d18" strokeWidth="1" />
        <circle cx="92" cy="38" r="4" fill="#33ccee" opacity="0.9" />
        <circle cx="110" cy="38" r="4" fill="#33ccee" opacity="0.9" />
    </svg>
);

// Default book data — replace with props or API fetch as needed
const defaultBook = {
    title: "The Cartographer of Lost Places",
    author: "Elena V. Moretti",
    category: "Literary Fiction",
    price: 28.90,
    sold: 1240,
    stock: 12,
    age: 16,
    image: null,
};

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cart, addToCart } = useCart();

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const data = await bookService.getBookById(id);
                setBook(data);
                
                if (data.category) {
                    const relatedRes = await bookService.getBooks({ category: data.category, _limit: 5 });
                    const filtered = relatedRes.data.filter(b => String(b.id) !== String(id)).slice(0, 4);
                    setRelatedBooks(filtered);
                }
                
                setError(null);
            } catch (err) {
                setError("Failed to load book data.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBook();
    }, [id]);

    if (loading) {
        return (
            <div className="bd-wrap">
                <div style={{ padding: "5rem", textAlign: "center", color: "#666" }}>Loading book details...</div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="bd-wrap">
                <div style={{ padding: "5rem", textAlign: "center", color: "#e24b4a" }}>{error || "Book not found."}</div>
            </div>
        );
    }

    const displayPrice = typeof book.price === 'number' ? `$${(book.price / 1000).toFixed(2)}` : book.price;

    return (
        <div className="bd-wrap">
            {/* Navbar */}
            <nav className="bd-nav">
                <div className="bd-logo">The Literary Gallery</div>
                <div className="bd-nav-links">
                    <span className="active">Browse</span>
                    <span>New Arrivals</span>
                    <span>Curated Collections</span>
                </div>
                <div className="bd-nav-right">
                    {user ? (
                        <span className="bd-signin" onClick={() => { logout(); navigate("/login"); }}>Sign Out</span>
                    ) : (
                        <span className="bd-signin" onClick={() => navigate("/login")}>Sign In</span>
                    )}
                    <div className="bd-cart" onClick={() => navigate("/cart")}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M2 2h1.5l1 7h7l1-5H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="7" cy="13" r="1" fill="white" />
                            <circle cx="11" cy="13" r="1" fill="white" />
                        </svg>
                        {cart.length > 0 && <div className="bd-cart-badge">{cart.reduce((Sum, item) => Sum + item.quantity, 0)}</div>}
                    </div>
                </div>
            </nav>

            {/* Hero product section */}
            <section className="bd-hero">
                {book.image ? (
                    <div className="bd-book-img">
                        <img src={book.image} alt={book.title} />
                    </div>
                ) : (
                    <div className="bd-book-placeholder">
                        <svg viewBox="0 0 220 290" xmlns="http://www.w3.org/2000/svg" width="220" height="290">
                            <rect width="220" height="290" fill="#0d0d1a" rx="8" />
                            <ellipse cx="110" cy="130" rx="70" ry="85" fill="#1a1a2e" />
                            <ellipse cx="110" cy="110" rx="50" ry="58" fill="#222238" />
                            <path d="M75 100 Q110 70 145 100 Q125 125 110 122 Q95 125 75 100Z" fill="#2a2a45" />
                            <ellipse cx="97" cy="105" rx="9" ry="11" fill="#cc3322" opacity="0.85" />
                            <ellipse cx="123" cy="105" rx="9" ry="11" fill="#cc3322" opacity="0.85" />
                            <path d="M85 145 Q110 138 135 145 L140 200 Q110 210 80 200Z" fill="#1a1a2e" />
                            <path d="M95 145 Q110 140 125 145 L128 195 Q110 202 92 195Z" fill="#222238" />
                            <path d="M85 105 Q78 95 75 80 Q72 65 80 55" fill="none" stroke="#1a1a35" strokeWidth="8" />
                            <path d="M135 105 Q142 95 145 80 Q148 65 140 55" fill="none" stroke="#1a1a35" strokeWidth="8" />
                        </svg>
                    </div>
                )}

                <div className="bd-product-info">
                    <div className="bd-eyebrow">{book.category || "General"}</div>
                    <h1 className="bd-title">{book.title}</h1>
                    <p className="bd-author">by {book.author}</p>

                    <div className="bd-price-row">
                        <span className="bd-price">{displayPrice}</span>
                        <span className="bd-price-original">$34.00</span>
                        <span className="bd-discount">15% OFF</span>
                    </div>

                    <div className="bd-meta-row">
                        <div className="bd-meta-item">
                            <div className="bd-meta-label">Readers</div>
                            <div className="bd-meta-value">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <circle cx="4" cy="3" r="2" stroke="#555" strokeWidth="1" />
                                    <circle cx="8" cy="3" r="2" stroke="#555" strokeWidth="1" />
                                    <path d="M1 10 Q4 7 7 10" stroke="#555" strokeWidth="1" fill="none" />
                                    <path d="M5 10 Q8 7 11 10" stroke="#555" strokeWidth="1" fill="none" />
                                </svg>
                                {book.sold || 0} Sold
                            </div>
                        </div>
                        <div className="bd-meta-item">
                            <div className="bd-meta-label">Availability</div>
                            <div className="bd-meta-value">
                                <span className="bd-dot" style={{ background: book.stock > 0 ? "#22cc77" : "#e24b4a" }}></span>
                                {book.stock > 0 ? "In Stock" : "Out of Stock"}
                            </div>
                        </div>
                        <div className="bd-meta-item">
                            <div className="bd-meta-label">Classification</div>
                            <div className="bd-meta-value">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <circle cx="6" cy="5" r="3" stroke="#555" strokeWidth="1" />
                                    <path d="M3 10 Q6 8 9 10" stroke="#555" strokeWidth="1" fill="none" />
                                </svg>
                                Age {book.age || 0}+
                            </div>
                        </div>
                    </div>

                    <div className="bd-actions">
                        <div className="bd-qty">
                            <button className="bd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                            <div className="bd-qty-val">{qty}</div>
                            <button className="bd-qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                        </div>
                        <button className="bd-btn-cart" onClick={() => { 
                            if (!user) {
                                navigate('/login');
                            } else {
                                addToCart({ ...book, quantity: qty });
                            }
                        }}>Add to Cart</button>
                        <button className="bd-btn-buy" onClick={() => { if (!user) navigate('/login'); }}>Buy Now</button>
                    </div>
                </div>
            </section>

            {/* Narrative + Sentiment */}
            <section className="bd-narrative-section">
                <div className="bd-narrative">
                    <h2>The Narrative</h2>
                    <p>{book.description}</p>
                    <div className="bd-pub-row">
                        <div className="bd-pub-item">
                            <div className="bd-pub-label">Publisher</div>
                            <div className="bd-pub-value">L'Atelier Press</div>
                        </div>
                        <div className="bd-pub-item">
                            <div className="bd-pub-label">Language</div>
                            <div className="bd-pub-value">English (Traditional)</div>
                        </div>
                    </div>
                </div>

                <div className="bd-right-col">
                    <div className="bd-sentiment-card">
                        <div className="bd-sentiment-header">
                            <h3>Reader Sentiment</h3>
                            <span className="bd-stars">★★★★★</span>
                        </div>
                        <div className="bd-review">
                            <p>"A hauntingly beautiful exploration of nostalgia. The prose is as fluid as the waters of Venice itself."</p>
                            <cite>— Julian Thorne, Literary Review</cite>
                        </div>
                        <div className="bd-review">
                            <p>"Moretti's world-building is second to none. I felt the mist on my skin through every sentence."</p>
                            <cite>— Sarah Jenkins, Verified Purchase</cite>
                        </div>
                        <span className="bd-read-all">Read all 480 reviews</span>
                    </div>

                    <div className="bd-bookclub-card">
                        <h4>Book Club Pick</h4>
                        <p>Join 4,000 readers discussing this title this month in the Gallery Lounge.</p>
                        <button className="bd-join-btn">JOIN SESSION</button>
                    </div>
                </div>
            </section>

            {/* Related Masterpieces */}
            <section className="bd-related-section">
                <div className="bd-related-header">
                    <div>
                        <div className="bd-related-eyebrow">Curated Pairing</div>
                        <h2 className="bd-related-title">Related Masterpieces</h2>
                    </div>
                    <div className="bd-view-all">View Entire Genre →</div>
                </div>

                <div className="bd-related-grid">
                    {relatedBooks.map((relBook) => (
                        <div key={relBook.id} className="bd-related-card" onClick={() => navigate(`/book/${relBook.id}`)}>
                            <div className="bd-related-cover">
                                {relBook.image ? (
                                    <img src={relBook.image} alt={relBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#666', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Cover</div>
                                )}
                            </div>
                            <div className="bd-related-book-title">{relBook.title}</div>
                            <div className="bd-related-author">{relBook.author}</div>
                            <div className="bd-related-price">
                                {typeof relBook.price === 'number' ? `$${(relBook.price / 1000).toFixed(2)}` : relBook.price}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="bd-footer">
                    <div>
                        <div className="bd-footer-brand">The Literary Gallery</div>
                        <p className="bd-footer-desc">Curating the world's finest stories for the discerning mind. Every volume a treasure, every shelf a journey.</p>
                        <div className="bd-footer-icons">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#aaa" strokeWidth="1.2" /><path d="M5 8h6M8 5v6" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#aaa" strokeWidth="1.2" /><path d="M2 6l6 4 6-4" stroke="#aaa" strokeWidth="1.2" /></svg>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2h12v10H2z" stroke="#aaa" strokeWidth="1.2" /><path d="M5 6h6M5 8h4" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        </div>
                    </div>
                    <div>
                        <h5>Explore</h5>
                        <ul>
                            <li>Journal</li>
                            <li>Contact</li>
                            <li>Membership</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Information</h5>
                        <ul>
                            <li>Privacy</li>
                            <li>Terms</li>
                            <li>Shipping</li>
                        </ul>
                    </div>
                    <div>
                        <h5>The Newsletter</h5>
                        <p className="bd-newsletter-desc">Sign up for exclusive access to first editions and curator notes.</p>
                        <div className="bd-newsletter-input">
                            <input placeholder="Email" />
                            <button className="bd-newsletter-btn">→</button>
                        </div>
                    </div>
                </div>
                <div className="bd-footer-bottom">
                    <span>© 2024 The Literary Gallery. All rights reserved</span>
                    <span>Designed at The Atelier</span>
                </div>
            </footer>
        </div>
    );
}