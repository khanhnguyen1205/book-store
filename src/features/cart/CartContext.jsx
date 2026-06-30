import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { meetsAgeRequirement } from '../../utils/age';

const CartContext = createContext(null);

// Mỗi user có một giỏ riêng: cart:<email>. Chưa đăng nhập thì không có key.
const cartKeyFor = (user) => (user ? `cart:${user.email}` : null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const cartKey = cartKeyFor(user);

    // Giữ kèm key của giỏ trong state. Nhờ vậy khi đổi user, giỏ của user cũ
    // không bị ghi nhầm sang key của user mới (state.key chưa kịp khớp cartKey).
    const [cartState, setCartState] = useState({ key: null, items: [] });

    // Dọn key 'cart' toàn cục cũ (giỏ rác từ trước khi tách giỏ theo user).
    useEffect(() => {
        localStorage.removeItem('cart');
    }, []);

    // Nạp giỏ của user hiện tại; logout -> giỏ rỗng.
    useEffect(() => {
        if (!cartKey) {
            setCartState({ key: null, items: [] });
            return;
        }
        let items = [];
        try {
            const stored = localStorage.getItem(cartKey);
            if (stored) items = JSON.parse(stored);
        } catch {
            items = [];
        }
        setCartState({ key: cartKey, items });
    }, [cartKey]);

    // Lưu giỏ — chỉ khi giỏ trong state đúng là của user hiện tại.
    useEffect(() => {
        if (cartState.key && cartState.key === cartKey) {
            localStorage.setItem(cartState.key, JSON.stringify(cartState.items));
        }
    }, [cartState, cartKey]);

    const cart = cartState.items;

    const addToCart = (item) => {
        if (!isAuthenticated) {
            navigate('/login');
            return { ok: false, reason: 'auth' };
        }

        // Chốt chặn độ tuổi: không cho thêm sách vượt quá tuổi của user.
        if (!meetsAgeRequirement(user, item.age)) {
            return { ok: false, reason: 'age' };
        }

        setCartState((prev) => {
            const existingItem = prev.items.find(cartItem => cartItem.id === item.id);
            const items = existingItem
                ? prev.items.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                        : cartItem
                )
                : [...prev.items, { ...item, quantity: item.quantity || 1 }];
            return { ...prev, items };
        });
        return { ok: true };
    };

    const removeFromCart = (id) => {
        setCartState((prev) => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id),
        }));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return; // Prevent negative or zero quantity

        setCartState((prev) => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id ? { ...item, quantity } : item
            ),
        }));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used inside <CartProvider>');
    }
    return ctx;
};
