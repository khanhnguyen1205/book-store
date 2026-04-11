/**
 * Calculates the subtotal of the items in the cart.
 * @param {Array} cart - Array of cart items
 * @returns {number} Subtotal
 */
export const calculateSubtotal = (cart) => {
    return cart.reduce((total, item) => {
        // Handle both raw price (needs scaling) or direct price
        // Ensure price is treated consistently based on the app's standard format
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
 * Parses and formats price accurately handling the division logic seen in UI
 * @param {number|string} price 
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
    if (typeof price === 'number') {
        // App logic uses price/1000 in BookDetail, if numbers are huge.
        // Assuming price is direct if it's less than 1000, but logic applies.
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
