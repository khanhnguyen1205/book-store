import React, { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import { calculateTotals, formatPrice } from "../cart/cartUtils";
import { meetsAgeRequirement } from "../../utils/age";
import { orderService } from "./orderService";
import "./Order.css";

/** Validate form giao hàng + thẻ (chỉ kiểm tra ĐỊNH DẠNG — đây là demo, không thu tiền thật). */
function validate(shipping, paymentMethod, card) {
    const e = {};
    if (!shipping.fullName.trim()) e.fullName = "Required";
    if (!/^[0-9\s+()-]{8,}$/.test(shipping.phone.trim())) e.phone = "Enter a valid phone number";
    if (!shipping.address.trim()) e.address = "Required";
    if (!shipping.city.trim()) e.city = "Required";

    if (paymentMethod === "card") {
        if (!/^[0-9]{13,19}$/.test(card.number.replace(/\s/g, ""))) e.number = "Card number must be 13–19 digits";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
            e.expiry = "Use MM/YY";
        } else {
            const [mm, yy] = card.expiry.split("/").map(Number);
            const exp = new Date(2000 + yy, mm); // ngày đầu tháng sau khi hết hạn
            if (exp <= new Date()) e.expiry = "Card has expired";
        }
        if (!/^[0-9]{3,4}$/.test(card.cvv)) e.cvv = "3–4 digits";
        if (!card.name.trim()) e.cardName = "Required";
    }
    return e;
}

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { cart, clearCart } = useCart();

    // Chế độ "Buy Now": chỉ 1 cuốn truyền qua router state, không đụng giỏ hàng.
    const buyNowItem = location.state?.buyNow || null;
    const items = useMemo(
        () => (buyNowItem ? [buyNowItem] : cart),
        [buyNowItem, cart]
    );

    const totals = useMemo(() => calculateTotals(items), [items]);

    const [shipping, setShipping] = useState({
        fullName: user?.fullName || "",
        phone: "",
        address: "",
        city: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
    const [errors, setErrors] = useState({});
    const [placing, setPlacing] = useState(false);
    const [serverError, setServerError] = useState("");

    // Chốt chặn tuổi: nếu có cuốn user chưa đủ tuổi thì không cho đặt.
    const blockedItem = items.find((it) => !meetsAgeRequirement(user, it.age));

    const setShip = (field) => (e) => setShipping((p) => ({ ...p, [field]: e.target.value }));
    const setCardField = (field) => (e) => setCard((p) => ({ ...p, [field]: e.target.value }));

    // Giỏ rỗng (và không phải Buy Now) → quay lại giỏ.
    if (items.length === 0) {
        return (
            <div className="lg-wrap">
                <Navbar />
                <div className="co-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="co-link-btn">Browse books</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setServerError("");
        if (blockedItem) return;

        const validation = validate(shipping, paymentMethod, card);
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        setPlacing(true);
        try {
            const order = {
                userId: user.id,
                items: items.map((it) => ({
                    id: it.id,
                    title: it.title,
                    price: it.price,
                    quantity: it.quantity,
                    image: it.image || "",
                })),
                shipping,
                paymentMethod,
                amounts: totals,
                status: "pending",
                createdAt: new Date().toISOString(),
            };

            const created = await orderService.createOrder(order);
            await orderService.decrementStock(order.items);
            if (!buyNowItem) clearCart();

            navigate(`/order/${created.id}`, { replace: true });
        } catch (err) {
            setServerError("Could not place your order. Please try again.");
            setPlacing(false);
        }
    };

    const err = (f) => errors[f] && <span className="co-err">{errors[f]}</span>;

    return (
        <div className="lg-wrap">
            <Navbar />

            <div className="co-page">
                <div className="co-head">
                    <h1>Checkout</h1>
                    <Link to={buyNowItem ? "/" : "/cart"} className="co-back">← Back</Link>
                </div>

                {blockedItem && (
                    <div className="co-age-warning" role="alert">
                        “{blockedItem.title}” is age-restricted ({blockedItem.age}+) and cannot be
                        purchased on your account. Please remove it to continue.
                    </div>
                )}

                <form className="co-grid" onSubmit={handlePlaceOrder}>
                    {/* Left: shipping + payment */}
                    <div className="co-main">
                        <section className="co-card">
                            <h2>Shipping Information</h2>
                            <div className="co-field">
                                <label>Full name</label>
                                <input value={shipping.fullName} onChange={setShip("fullName")} />
                                {err("fullName")}
                            </div>
                            <div className="co-field">
                                <label>Phone</label>
                                <input value={shipping.phone} onChange={setShip("phone")} placeholder="0901 234 567" />
                                {err("phone")}
                            </div>
                            <div className="co-field">
                                <label>Address</label>
                                <input value={shipping.address} onChange={setShip("address")} placeholder="123 Đường ABC" />
                                {err("address")}
                            </div>
                            <div className="co-field">
                                <label>City</label>
                                <input value={shipping.city} onChange={setShip("city")} />
                                {err("city")}
                            </div>
                        </section>

                        <section className="co-card">
                            <h2>Payment Method</h2>
                            <label className={`co-pay-opt${paymentMethod === "cod" ? " active" : ""}`}>
                                <input
                                    type="radio"
                                    name="pay"
                                    checked={paymentMethod === "cod"}
                                    onChange={() => setPaymentMethod("cod")}
                                />
                                <span><strong>Cash on Delivery</strong><br />Pay with cash when your order arrives.</span>
                            </label>
                            <label className={`co-pay-opt${paymentMethod === "card" ? " active" : ""}`}>
                                <input
                                    type="radio"
                                    name="pay"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                />
                                <span><strong>Credit / Debit Card</strong><br />Pay now by card.</span>
                            </label>

                            {paymentMethod === "card" && (
                                <div className="co-card-fields">
                                    <div className="co-demo-note">Demo only — do not enter a real card number.</div>
                                    <div className="co-field">
                                        <label>Card number</label>
                                        <input value={card.number} onChange={setCardField("number")} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                                        {err("number")}
                                    </div>
                                    <div className="co-field-row">
                                        <div className="co-field">
                                            <label>Expiry</label>
                                            <input value={card.expiry} onChange={setCardField("expiry")} placeholder="MM/YY" />
                                            {err("expiry")}
                                        </div>
                                        <div className="co-field">
                                            <label>CVV</label>
                                            <input value={card.cvv} onChange={setCardField("cvv")} placeholder="123" inputMode="numeric" />
                                            {err("cvv")}
                                        </div>
                                    </div>
                                    <div className="co-field">
                                        <label>Name on card</label>
                                        <input value={card.name} onChange={setCardField("name")} />
                                        {err("cardName")}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right: order summary */}
                    <aside className="co-summary">
                        <h2>Order Summary</h2>
                        <div className="co-items">
                            {items.map((it) => (
                                <div className="co-item" key={it.id}>
                                    <div className="co-item-thumb">
                                        {it.image
                                            ? <img src={it.image} alt={it.title} />
                                            : <span>No cover</span>}
                                        <span className="co-item-qty">{it.quantity}</span>
                                    </div>
                                    <div className="co-item-title">{it.title}</div>
                                    <div className="co-item-price">{formatPrice(it.price * it.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="co-row"><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
                        <div className="co-row"><span>Shipping</span><span>{formatPrice(totals.shipping)}</span></div>
                        <div className="co-row"><span>Tax (8.5%)</span><span>{formatPrice(totals.tax)}</span></div>
                        <div className="co-row co-total"><span>Total</span><span>{formatPrice(totals.total)}</span></div>

                        {serverError && <div className="co-server-err">{serverError}</div>}

                        <button type="submit" className="co-place-btn" disabled={placing || !!blockedItem}>
                            {placing ? "Placing order..." : `Place Order · ${formatPrice(totals.total)}`}
                        </button>
                        <p className="co-secure-note">This is a simulated checkout — no real payment is processed.</p>
                    </aside>
                </form>
            </div>

            <Footer />
        </div>
    );
}
