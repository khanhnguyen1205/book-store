import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { formatPrice } from "../cart/cartUtils";
import { orderService } from "./orderService";
import "./Order.css";

const PAYMENT_LABELS = { cod: "Cash on Delivery", card: "Credit / Debit Card" };

export default function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        orderService
            .getOrderById(id)
            .then((data) => active && setOrder(data))
            .catch(() => active && setError("Order not found."))
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [id]);

    return (
        <div className="lg-wrap">
            <Navbar />

            <div className="co-page">
                {loading ? (
                    <div className="co-empty"><p>Loading order...</p></div>
                ) : error || !order ? (
                    <div className="co-empty">
                        <p>{error || "Order not found."}</p>
                        <Link to="/" className="co-link-btn">Back to store</Link>
                    </div>
                ) : (
                    <>
                        <div className="co-confirm-head">
                            <div className="co-check" aria-hidden="true">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <h1>Thank you for your order!</h1>
                            <p>Order <strong>#{order.id}</strong> has been placed successfully.</p>
                        </div>

                        <div className="co-grid">
                            <div className="co-main">
                                <section className="co-card">
                                    <h2>Items</h2>
                                    <div className="co-items">
                                        {order.items.map((it) => (
                                            <div className="co-item" key={it.id}>
                                                <div className="co-item-thumb">
                                                    {it.image ? <img src={it.image} alt={it.title} /> : <span>No cover</span>}
                                                    <span className="co-item-qty">{it.quantity}</span>
                                                </div>
                                                <div className="co-item-title">{it.title}</div>
                                                <div className="co-item-price">{formatPrice(it.price * it.quantity)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="co-card">
                                    <h2>Delivery</h2>
                                    <div className="co-detail-line"><span>Recipient</span><span>{order.shipping.fullName}</span></div>
                                    <div className="co-detail-line"><span>Phone</span><span>{order.shipping.phone}</span></div>
                                    <div className="co-detail-line"><span>Address</span><span>{order.shipping.address}, {order.shipping.city}</span></div>
                                    <div className="co-detail-line"><span>Payment</span><span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span></div>
                                    <div className="co-detail-line"><span>Status</span><span className="co-status">{order.status}</span></div>
                                </section>
                            </div>

                            <aside className="co-summary">
                                <h2>Summary</h2>
                                <div className="co-row"><span>Subtotal</span><span>{formatPrice(order.amounts.subtotal)}</span></div>
                                <div className="co-row"><span>Shipping</span><span>{formatPrice(order.amounts.shipping)}</span></div>
                                <div className="co-row"><span>Tax</span><span>{formatPrice(order.amounts.tax)}</span></div>
                                <div className="co-row co-total"><span>Total</span><span>{formatPrice(order.amounts.total)}</span></div>
                                <Link to="/orders" className="co-place-btn co-btn-link">View my orders</Link>
                                <Link to="/" className="co-secondary-btn">Continue shopping</Link>
                            </aside>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
