import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, customerName, items } = location.state || {};

    if (!orderId) {
        navigate('/');
        return null;
    }

    return (
        <div className="confirmation-page">
            <div className="confirmation-card">
                <div className="success-icon">✓</div>
                <h1>Order has been successfully placed.</h1>
                <p className="thank-you">Thank you!</p>
                
                <div className="order-number-container">
                    <p className="order-number-label">Your Order Number</p>
                    <div className="order-number">#{orderId}</div>
                </div>
                
                <div className="status-message">
                    <div className="status-badge">Processing</div>
                    <p>Your order is being prepared. We'll notify you when ready.</p>
                </div>
                
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                        {items?.map((item, idx) => (
                            <div key={idx} className="summary-item">
                                <span className="item-qty">{item.quantity}×</span>
                                <span className="item-name">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="action-buttons">
                    <button 
                        onClick={() => navigate('/')} 
                        className="btn-home"
                    >
                        Back to Menu
                    </button>
                    <button 
                        onClick={() => navigate(`/track-order/${orderId}`)} 
                        className="btn-track"
                    >
                        Track Order
                    </button>
                </div>
                
                <p className="info-note">
                    Save your order number #{orderId} to check status later
                </p>
            </div>
        </div>
    );
};

export default OrderConfirmation;