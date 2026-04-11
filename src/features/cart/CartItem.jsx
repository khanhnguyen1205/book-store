import React from 'react';
import './CartItem.css';
import { useCart } from './CartContext';
import { formatPrice } from './cartUtils';

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="cart-item">
            <div className="cart-item-cover">
                {item.cover ? item.cover : item.image ? <img src={item.image} alt={item.title} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 10 }}>No Cover</div>}
            </div>
            <div className="cart-item-info">
                <div className="cart-item-title">{item.title}</div>
                <div className="cart-item-author">{item.author}</div>
                <div className="cart-item-qty">
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <div className="cart-qty-val">{item.quantity}</div>
                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
            </div>
            <div className="cart-item-right">
                <button className="cart-item-delete" onClick={() => removeFromCart(item.id)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 4h10M6 4V2.5h4V4M5 4l.5 9h5L11 4" stroke="#ccc" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="cart-item-price">{formatPrice(item.price)}</div>
            </div>
        </div>
    );
}
