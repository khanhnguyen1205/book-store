import React from "react";
import "./Cart.css";
import CartItem from "./CartItem";
import { useCart } from "./CartContext";
import { calculateSubtotal, calculateTax, formatPrice } from "./cartUtils";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

/* ── SVG Book Covers ── */
const Cover1 = () => (
    <svg viewBox="0 0 88 110" xmlns="http://www.w3.org/2000/svg">
        <rect width="88" height="110" fill="#0d1520" />
        <circle cx="44" cy="35" r="22" fill="#1a2535" />
        <circle cx="44" cy="30" r="14" fill="#253045" />
        <ellipse cx="44" cy="28" rx="8" ry="10" fill="#303a50" />
        <path d="M20 70 Q44 55 68 70 L70 95 Q44 100 18 95Z" fill="#1a2535" />
        <text x="44" y="107" textAnchor="middle" fontSize="5" fill="#4a5a70" fontFamily="sans-serif" letterSpacing="1">THE ART OF SILENCE</text>
    </svg>
);

const Cover2 = () => (
    <svg viewBox="0 0 88 110" xmlns="http://www.w3.org/2000/svg">
        <rect width="88" height="110" fill="#0f1a10" />
        <rect x="0" y="50" width="88" height="60" fill="#0a1208" />
        <path d="M0 50 Q22 35 44 42 Q66 35 88 50" fill="#1a2a1a" />
        <path d="M15 55 Q30 25 44 40 Q58 25 73 55" fill="none" stroke="#2a4a2a" strokeWidth="1" />
        <circle cx="44" cy="38" r="6" fill="#c8d8a0" opacity="0.3" />
        <line x1="44" y1="0" x2="44" y2="38" stroke="#3a5a3a" strokeWidth="0.5" opacity="0.5" />
        <text x="44" y="107" textAnchor="middle" fontSize="5" fill="#3a5a3a" fontFamily="sans-serif" letterSpacing="1">ECHOES OF THE FOREST</text>
    </svg>
);

const Cover3 = () => (
    <svg viewBox="0 0 88 110" xmlns="http://www.w3.org/2000/svg">
        <rect width="88" height="110" fill="#2a1a3a" />
        <ellipse cx="44" cy="55" rx="32" ry="38" fill="#3a2a50" />
        <ellipse cx="44" cy="50" rx="20" ry="25" fill="#4a3a60" />
        <path d="M28 72 Q34 65 40 70 Q44 74 48 70 Q54 65 60 72" fill="none" stroke="#9070c0" strokeWidth="1.5" opacity="0.7" />
        <path d="M32 78 Q36 73 44 76 Q52 73 56 78" fill="none" stroke="#9070c0" strokeWidth="1" opacity="0.5" />
        <path d="M36 84 Q40 81 44 83 Q48 81 52 84" fill="none" stroke="#9070c0" strokeWidth="0.8" opacity="0.4" />
        <text x="44" y="107" textAnchor="middle" fontSize="5" fill="#9070c0" fontFamily="sans-serif" letterSpacing="1">THE LAVENDER JOURNALS</text>
    </svg>
);

/* ── Shoe illustration placeholder for upsell ── */
const ShoeIllustration = () => (
    <svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" width="140" height="120">
        <ellipse cx="70" cy="95" rx="55" ry="10" fill="#e8e0d8" opacity="0.4" />
        <path d="M30 85 Q35 60 55 58 Q70 56 80 62 Q95 68 110 72 Q118 74 115 82 Q112 88 100 90 Q75 94 30 85Z" fill="#c8b8a0" />
        <path d="M55 58 Q60 40 68 35 Q74 31 78 38 Q82 48 80 62" fill="#c0aa90" />
        <path d="M68 35 Q72 28 76 30 Q80 33 78 38" fill="#b89878" />
        <path d="M30 85 Q28 82 35 78 Q50 72 70 72 Q90 72 110 74" fill="none" stroke="#b09080" strokeWidth="1" />
        <ellipse cx="72" cy="88" rx="40" ry="6" fill="#b8a888" opacity="0.3" />
    </svg>
);

    // You can remove MOCK_ITEMS if making a purely dynamic app, or keep it around as fallback.
    // Assuming context is now our primary source.

export default function CartPage() {
    const { cart } = useCart();
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const shipping = cart.length > 0 ? 12.00 : 0;
    const total = subtotal + tax + shipping;

    return (
        <div className="cart-page">

            <Navbar />

            {/* Page Header */}
            <div className="cart-header">
                <h1>Your Curated Collection</h1>
                <div className="cart-header-sub">{cart.length} Items in your cart</div>
            </div>

            {/* Main body: items + summary */}
            <div className="cart-body">
                {/* Cart Items */}
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
                            Your cart is empty.
                        </div>
                    ) : (
                        cart.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))
                    )}
                </div>

                {/* Summary */}
                <div className="cart-summary">
                    <h2>Summary</h2>
                    <div className="cart-summary-row">
                        <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Estimated Shipping</span><span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Tax (8.5%)</span><span>{formatPrice(tax)}</span>
                    </div>
                    <div className="cart-summary-divider" />
                    <div className="cart-total-row">
                        <span className="cart-total-label">Total</span>
                        <span className="cart-total-value">{formatPrice(total)}</span>
                    </div>
                    <button className="cart-checkout-btn">
                        Proceed to Checkout
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="cart-premium-note">
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                            <rect x="1" y="4" width="18" height="11" rx="2" stroke="#5555aa" strokeWidth="1.3" />
                            <path d="M1 7h18M5 1l-2 3M10 1v3M15 1l2 3" stroke="#5555aa" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                        <div><strong>Premium Curation:</strong> All orders are hand-wrapped in artisan parchment and shipped via priority courier.</div>
                    </div>
                    <Link to="/" className="cart-continue" style={{ textDecoration: 'none' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9 3L5 7l4 4" stroke="#888" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Continue Browsing
                    </Link>
                </div>
            </div>

            {/* Upsell */}
            <div className="cart-upsell">
                <h2>Consider adding to your library</h2>
                <div className="cart-upsell-grid">
                    <div className="cart-upsell-promo">
                        <div className="cart-upsell-promo-text">
                            <div className="cart-upsell-eyebrow">Limited Edition</div>
                            <div className="cart-upsell-title">The Complete Works of Virginia Woolf</div>
                            <div className="cart-upsell-desc">A linen-bound masterpiece set for the discerning collector.</div>
                            <div className="cart-upsell-link">
                                View Details
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M3 7h8M8 4l3 3-3 3" stroke="#3333cc" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="cart-upsell-img">
                            <ShoeIllustration />
                        </div>
                    </div>

                    <div className="cart-member-card">
                        <div>
                            <div className="cart-member-icon">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect x="4" y="3" width="20" height="22" rx="2" stroke="white" strokeWidth="1.5" />
                                    <path d="M9 9h10M9 13h10M9 17h6" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="cart-member-title">Member's Journal access</div>
                            <div className="cart-member-desc">Get complimentary digital editions of all curations.</div>
                        </div>
                        <button className="cart-member-btn">Learn More</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer>
                <div className="cart-footer">
                    <div>
                        <div className="cart-footer-brand">The Literary Gallery</div>
                        <p className="cart-footer-desc">Defining the digital frontier for physical books. Curated with soul, delivered with grace.</p>
                    </div>
                    <div>
                        <h5>Explore</h5>
                        <ul>
                            <li>Journal</li>
                            <li>Collections</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Support</h5>
                        <ul>
                            <li>Contact</li>
                            <li>Shipping</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Legal</h5>
                        <ul>
                            <li>Privacy</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                </div>
                <div className="cart-footer-bottom">
                    © 2024 The Literary Gallery. All rights reserved.
                </div>
            </footer>
        </div>
    );
}