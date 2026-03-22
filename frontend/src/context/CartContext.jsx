import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const Cart = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart
    useEffect(() => {
        const savedCart = localStorage.getItem('grainCart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart:', error);
                setCart([]);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('grainCart', JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    // Add item to cart
    const addToCart = (item) => {
        const cartItem = {
            ...item,
            cartItemId: Date.now() + Math.random().toString(36) // Generate unique ID with timestamp
        };
        
        setCart(prev => [...prev, cartItem]);
        return cartItem;
    };

    // Remove item
    const removeFromCart = (cartItemId) => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    // Update quantity
    const updateQuantity = (cartItemId, newQuantity) => {
        setCart(prev => prev.map(item => 
        item.cartItemId === cartItemId 
            ? { ...item, quantity: Math.max(1, newQuantity) }
            : item
        ));
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
    };

    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

    // Check if cart is empty
    const isCartEmpty = cart.length === 0;

    // Value provided to consumers
    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        isCartEmpty
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a Cart');
    }
    return context;
};