import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "./bookService";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import { getAge, meetsAgeRequirement } from "../../utils/age";
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
    const [buyNote, setBuyNote] = useState("");
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

    // Giới hạn độ tuổi: chỉ chặn khi user đã đăng nhập và chưa đủ tuổi.
    const minAge = book.age || 0;
    const isRestricted = user ? !meetsAgeRequirement(user, minAge) : false;
    const userAge = getAge(user?.dateOfBirth);

    // Đánh giá thật từ dữ liệu sách.
    const ratingValue = Number(book.rating) || 0;
    const reviewCount = Number(book.reviews) || 0;

    // Thông số sách (Product Details) — chỉ hiện field nào có dữ liệu.
    const productDetails = [
        { label: "Publisher", value: book.publisher },
        { label: "Published", value: book.publishedYear },
        { label: "Language", value: book.language },
        { label: "Print length", value: book.pages ? `${book.pages} pages` : null },
        { label: "ISBN", value: book.isbn },
        { label: "Category", value: book.category },
    ].filter((row) => row.value);

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
                        <button className="bd-btn-cart" disabled={isRestricted} onClick={() => {
                            if (!user) {
                                navigate('/login');
                            } else {
                                addToCart({ ...book, quantity: qty });
                            }
                        }}>Add to Cart</button>
                        <button className="bd-btn-buy" disabled={isRestricted} onClick={() => {
                            if (!user) {
                                navigate('/login');
                            } else {
                                setBuyNote("Instant checkout is coming soon — use Add to Cart for now.");
                            }
                        }}>Buy Now</button>
                    </div>
                    {isRestricted ? (
                        <div className="bd-age-block" role="alert">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 3 3 19h18L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <circle cx="12" cy="16.5" r="0.4" fill="currentColor" stroke="currentColor" strokeWidth="0.9" />
                            </svg>
                            <div>
                                <strong>Age-restricted title — {minAge}+</strong>
                                <p>
                                    This book is intended for readers aged {minAge} and over. Your account
                                    {userAge !== null ? ` (age ${userAge})` : ""} does not meet the minimum age,
                                    so it can’t be added to your cart or purchased.
                                </p>
                            </div>
                        </div>
                    ) : (
                        buyNote && <div className="bd-buy-note">{buyNote}</div>
                    )}
                </div>
            </section>

            {/* Narrative + Sentiment */}
            <section className="bd-narrative-section">
                <div className="bd-narrative">
                    <h2>About this Book</h2>
                    {String(book.description || "")
                        .split("\n\n")
                        .filter(Boolean)
                        .map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}

                    <h3 className="bd-details-title">Product Details</h3>
                    <div className="bd-details-grid">
                        {productDetails.map((row) => (
                            <div className="bd-detail-item" key={row.label}>
                                <div className="bd-detail-label">{row.label}</div>
                                <div className="bd-detail-value">{row.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bd-right-col">
                    <div className="bd-rating-card">
                        <h3 className="bd-rating-heading">Customer Reviews</h3>
                        <div className="bd-rating-summary">
                            <div className="bd-rating-score">{ratingValue.toFixed(1)}</div>
                            <div>
                                <div className="bd-stars-track" aria-label={`${ratingValue} out of 5 stars`}>
                                    <span className="bd-stars-empty">★★★★★</span>
                                    <span className="bd-stars-fill" style={{ width: `${(ratingValue / 5) * 100}%` }}>★★★★★</span>
                                </div>
                                <div className="bd-rating-count">{reviewCount.toLocaleString()} global ratings</div>
                            </div>
                        </div>
                        <div className="bd-rating-out">out of 5</div>
                    </div>

                    <div className="bd-bookclub-card">
                        <h4>Book Club Pick</h4>
                        <p>Join {(book.sold || 0).toLocaleString()} readers who have added this title to their collection.</p>
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