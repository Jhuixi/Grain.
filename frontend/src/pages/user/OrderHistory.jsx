import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/orders/user/${user.user_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            } else {
                setError('Failed to load orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { class: 'status-pending', text: 'Pending' },
            'confirmed': { class: 'status-confirmed', text: 'Confirmed' },
            'preparing': { class: 'status-preparing', text: 'Preparing' },
            'ready': { class: 'status-ready', text: 'Ready for Pickup' },
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
            <div className="history-loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-error">
                <p>{error}</p>
                <button onClick={() => navigate('/')} className="btn-primary">
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="history-page">
            <div className="history-header">
                <button onClick={() => navigate('/profile')} className="back-btn">
                    ← Back to Profile
                </button>
                <h1>Order History</h1>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <div className="empty-icon">📋</div>
                    <h2>No orders yet</h2>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div 
                            key={order.order_id} 
                            className="order-card"
                            onClick={() => navigate(`/orders/${order.order_id}`)}
                        >
                            <div className="order-card-header">
                                <div className="order-number">Order #{order.order_id}</div>
                                {getStatusBadge(order.status)}
                            </div>
                            <div className="order-card-body">
                                <div className="order-date">
                                    {formatDate(order.order_date)}
                                </div>
                                {order.completed_date && (
                                    <div className="order-completed">
                                    Completed on: {formatDate(order.completed_date)}
                                </div>
                                )}
                            </div>
                            <div className="order-card-footer">
                                <span className="view-details">View Details →</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;