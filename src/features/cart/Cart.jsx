import React, { useState, useEffect } from "react";
import "./Cart.css";
import CartItem from "./CartItem";
import { useCart } from "./CartContext";
import { calculateSubtotal, calculateTax, formatPrice } from "./cartUtils";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookCard from "../../components/BookCard";
import { bookService } from "../book/bookService";

export default function CartPage() {
    const { cart } = useCart();
    const navigate = useNavigate();
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const shipping = cart.length > 0 ? 12.00 : 0;
    const total = subtotal + tax + shipping;

    // Thông báo tạm khi bấm Checkout (tính năng chưa hoàn thiện).
    const [checkoutNote, setCheckoutNote] = useState("");

    // "You might also like": gợi ý sách thật từ catalog, bỏ các cuốn đã có trong giỏ.
    const [recommended, setRecommended] = useState([]);
    useEffect(() => {
        let active = true;
        bookService
            .getBooks()
            .then(({ data }) => {
                if (!active) return;
                const inCart = new Set(cart.map((item) => item.id));
                setRecommended(data.filter((book) => !inCart.has(book.id)).slice(0, 4));
            })
            .catch(() => active && setRecommended([]));
        return () => { active = false; };
    }, [cart]);

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
                    <button
                        className="cart-checkout-btn"
                        disabled={cart.length === 0}
                        onClick={() => setCheckoutNote("Checkout is coming soon — thanks for your patience!")}
                    >
                        Proceed to Checkout
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {checkoutNote && <div className="cart-checkout-note">{checkoutNote}</div>}
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

            {/* You might also like — gợi ý sách thật từ catalog */}
            {recommended.length > 0 && (
                <div className="cart-upsell">
                    <h2>You might also like</h2>
                    <div className="cart-rec-grid">
                        {recommended.map((book) => (
                            <div
                                key={book.id}
                                className="cart-rec-item"
                                onClick={() => navigate(`/book/${book.id}`)}
                            >
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}