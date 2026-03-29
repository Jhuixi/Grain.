import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Order.css';

const Order = () => {
    const { cart, clearCart, itemCount } = useCart();
    const navigate = useNavigate();
    
    const [guestName, setGuestName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setUserName(user.username);
        }
    }, []);

    const handleConfirmOrder = async () => {
        if (!isLoggedIn && !guestName.trim()) {
            setError('Please enter your name');
            return;
        }
        
        setIsPlacingOrder(true);
        setError('');
        
        try {
            const orderData = {
                items: cart.map(item => ({
                    item_id: item.item_id,
                    quantity: item.quantity,
                    customisations: item.customisations,
                    remarks: item.remarks || null
                })),
                guestName: !isLoggedIn ? guestName : null,
                // userId: isLoggedIn ? userId : null
            };
            const response = await fetch(`http://localhost:5001/api/createOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            
            if (!data.success) {
            throw new Error(data.message);
            }
            
            clearCart();
            
            navigate(`/order-confirmation/${data.data.orderId}`, {
                state: { 
                    orderId: data.data.orderId,
                    customerName: isLoggedIn ? userName : guestName,
                    items: cart
                }
            });
            
        } catch (error) {
            console.error('Error placing order:', error);
            setError('Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (cart.length === 0) {
        return null;
    }

    return (
        <div className="order-page">
            <h1>Review Your Order</h1>
            <p className="order-subtitle">Please confirm your items before submitting</p>
            
            <div className="order-container">
                <div className="order-summary">
                    <div className="order-summary-header">
                        <h2>Your Items</h2>
                        <p>{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                    </div>
                    
                    <div className="order-items">
                        {cart.map((item) => (
                            <div key={item.cartItemId} className="order-item">
                                <div className="order-item-header">
                                    <span className="item-quantity">{item.quantity}×</span>
                                    <span className="item-name">{item.name}</span>
                                </div>
                                
                                {item.customisations && Object.keys(item.customisations).length > 0 && (
                                <div className="order-item-customisations">
                                    {Object.entries(item.customisations).map(([groupId, data]) => (
                                        <div key={groupId} className="customisation-line">
                                            {data.groupName}: {data.options.map(opt => opt.name).join(', ')}
                                        </div>
                                    ))}
                                </div>
                                )}
                                
                                {item.remarks && (
                                    <div className="order-item-remarks">
                                        "{item.remarks}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Customer Info */}
                <div className="customer-info">
                    <h2>Pickup Details</h2>
                    
                    {isLoggedIn ? (
                        <div className="logged-in-info">
                            <div className="info-row">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{userName}</span>
                            </div>
                            <p className="info-note">Order ready for pickup</p>
                        </div>
                    ) : (
                        <div className="guest-form">
                            <label htmlFor="guestName">Your Name</label>
                            <input
                                type="text"
                                id="guestName"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Enter your name"
                                className="guest-name-input"
                            />
                            <p className="helper-text">We'll use this to identify your order</p>
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    )}
                </div>
                
                {/* Actions */}
                <div className="order-actions">
                    <button 
                        onClick={() => navigate('/cart')} 
                        className="btn-secondary"
                    >
                        ← Back to Cart
                    </button>
                    <button 
                        onClick={handleConfirmOrder}
                        disabled={isPlacingOrder || (!isLoggedIn && !guestName.trim())}
                        className="btn-primary"
                    >
                        {isPlacingOrder ? 'Placing...' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Order;