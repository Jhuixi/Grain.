import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/OrderHistoryDetails.css';

const OrderHistoryDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError('Failed to load order details');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { class: 'status-pending', text: 'Pending' },
            'confirmed': { class: 'status-confirmed', text: 'Confirmed' },
            'preparing': { class: 'status-preparing', text: 'Preparing' },
            'ready': { class: 'status-ready', text: 'Ready' },
            'completed': { class: 'status-completed', text: 'Completed' },
            'cancelled': { class: 'status-cancelled', text: 'Cancelled' }
        };
        const config = statusConfig[status] || { class: 'status-pending', text: status };
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-SG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="details-loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="details-error">
                <p>{error || 'Order not found'}</p>
                <button onClick={() => navigate('/orders')} className="btn-primary">
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="details-page">
            <div className="details-header">
                <button onClick={() => navigate('/orders')} className="back-btn">
                    ← Back to Orders
                </button>
                <h1>Order #{order.orderId}</h1>
            </div>

            <div className="details-container">
                {/* Order Info Card */}
                <div className="info-card">
                    <div className="info-row">
                        <span className="info-label">Status:</span>
                        <span className="info-value">{getStatusBadge(order.status)}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Order Date:</span>
                        <span className="info-value">{formatDate(order.orderDate)}</span>
                    </div>
                    {order.completedDate && (
                        <div className="info-row">
                            <span className="info-label">Completed Date:</span>
                            <span className="info-value">{formatDate(order.completedDate)}</span>
                        </div>
                    )}
                </div>

                {/* Items Card */}
                <div className="items-card">
                    <h2>Order Items</h2>
                    <div className="items-list">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="order-item-detail">
                                <div className="item-header">
                                    <span className="item-quantity">{item.quantity}×</span>
                                    <span className="item-name">{item.item_name}</span>
                                </div>
                                
                                {/* Customisations */}
                                {item.customisations && Object.keys(item.customisations).length > 0 && (
                                    <div className="item-customisations">
                                        {Object.entries(item.customisations).map(([groupId, data]) => (
                                            <div key={groupId} className="customisation-line">
                                                {data.groupName}: {data.options.map(opt => opt.name).join(', ')}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Remarks */}
                                {item.remarks && (
                                    <div className="item-remarks">
                                        "{item.remarks}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="details-actions">
                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Back to Menu
                    </button>
                    <button onClick={() => navigate('/orders')} className="btn-primary">
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryDetails;