import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "./bookService";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./BookDetail.css";

export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();

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
            <Navbar />

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

            <Footer />
        </div>
    );
}