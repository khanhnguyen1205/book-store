import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../auth/AuthContext";
import { formatPrice } from "../cart/cartUtils";
import { orderService } from "./orderService";
import "./Order.css";

const formatDate = (iso) => {
    try {
        return new Date(iso).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
        });
    } catch {
        return "";
    }
};

export default function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        let active = true;
        orderService
            .getOrdersByUser(user.id)
            .then((data) => active && setOrders(data))
            .catch(() => active && setOrders([]))
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [user]);

    return (
        <div className="lg-wrap">
            <Navbar />

            <div className="co-page">
                <div className="co-head">
                    <h1>My Orders</h1>
                </div>

                {loading ? (
                    <div className="co-empty"><p>Loading your orders...</p></div>
                ) : orders.length === 0 ? (
                    <div className="co-empty">
                        <p>You haven’t placed any orders yet.</p>
                        <Link to="/" className="co-link-btn">Start shopping</Link>
                    </div>
                ) : (
                    <div className="co-order-list">
                        {orders.map((order) => {
                            const count = order.items.reduce((s, it) => s + it.quantity, 0);
                            return (
                                <Link to={`/order/${order.id}`} className="co-order-row" key={order.id}>
                                    <div>
                                        <div className="co-order-id">Order #{order.id}</div>
                                        <div className="co-order-meta">{formatDate(order.createdAt)} · {count} item{count > 1 ? "s" : ""}</div>
                                    </div>
                                    <div className="co-order-right">
                                        <span className="co-status">{order.status}</span>
                                        <span className="co-order-total">{formatPrice(order.amounts.total)}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
