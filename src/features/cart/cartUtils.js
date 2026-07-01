/**
 * Calculates the subtotal of the items in the cart.
 * @param {Array} cart - Array of cart items
 * @returns {number} Subtotal
 */
export const calculateSubtotal = (cart) => {
    return cart.reduce((total, item) => {
        // Bỏ qua item có price không phải số để tránh NaN lan ra tổng tiền.
        const price = typeof item.price === 'number' ? item.price : 0;
        return total + (price * item.quantity);
    }, 0);
};

/**
 * Calculates the tax based on a subtotal and rate.
 * @param {number} subtotal 
 * @param {number} rate - Tax rate as a decimal (e.g. 0.085 for 8.5%)
 * @returns {number}
 */
export const calculateTax = (subtotal, rate = 0.085) => {
    return subtotal * rate;
};

/**
 * Phí ship cố định, để cùng "thang giá thô" với price (vd 12000 ~ $12.00 sau formatPrice).
 */
export const SHIPPING_FEE = 12000;

/**
 * Gộp toàn bộ số tiền của một đơn/giỏ về một chỗ để Cart và Checkout dùng chung,
 * tránh lệch nhau. Trả về các giá trị ở thang giá thô (formatPrice tự chia 1000 khi hiển thị).
 */
export const calculateTotals = (items) => {
    const subtotal = calculateSubtotal(items);
    const shipping = items.length > 0 ? SHIPPING_FEE : 0;
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
};

/**
 * Định dạng giá tiền. Giá trong DB để ở "thang thô" (vd 150000) nên khi lớn
 * hơn 1000 thì chia 1000 trước khi hiển thị; giá đã nhỏ sẵn thì giữ nguyên.
 * @param {number|string} price
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
    if (typeof price === 'number') {
        if (price > 1000) {
            return `$${(price / 1000).toFixed(2)}`;
        }
        return `$${price.toFixed(2)}`;
    }
    if (typeof price === 'string' && !price.startsWith('$')) {
        return `$${price}`;
    }
    return price || '$0.00';
};
