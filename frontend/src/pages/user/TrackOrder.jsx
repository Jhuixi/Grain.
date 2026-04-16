import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/TrackOrder.css';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5001/api/orders/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, name })
            });

            const data = await response.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.message || 'Order not found');
            }
        } catch (error) {
            console.error('Error tracking order:', error);
            setError('Failed to track order. Please try again.');
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="track-order-page">
            <div className="track-order-container">
                <h1>Track Your Order</h1>
                <p className="subtitle">Enter your order number and name to check status</p>

                <form onSubmit={handleSubmit} className="track-form">
                    <div className="form-group">
                        <label htmlFor="orderId">Order Number</label>
                        <input
                            type="number"
                            id="orderId"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="e.g., 123"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name used when ordering"
                            required
                        />
                    </div>
                    <button type="submit" className="track-btn" disabled={loading}>
                        {loading ? 'Tracking...' : 'Track Order'}
                    </button>
                </form>

                {error && <div className="track-error">{error}</div>}

                {order && (
                    <div className="order-result">
                        <h2>Order #{order.orderId}</h2>
                        
                        <div className="result-info">
                            <div className="info-row">
                                <span className="label">Status:</span>
                                <span className="value">{getStatusBadge(order.status)}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Order Date:</span>
                                <span className="value">{formatDate(order.orderDate)}</span>
                            </div>
                            {order.completedDate && (
                                <div className="info-row">
                                    <span className="label">Completed:</span>
                                    <span className="value">{formatDate(order.completedDate)}</span>
                                </div>
                            )}
                            <div className="info-row">
                                <span className="label">Customer:</span>
                                <span className="value">{order.customerName}</span>
                            </div>
                        </div>

                        <div className="result-items">
                            <h3>Items</h3>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="track-item">
                                    <div className="item-header">
                                        <span className="item-qty">{item.quantity}×</span>
                                        <span className="item-name">{item.item_name}</span>
                                    </div>
                                    {item.customisations && Object.keys(item.customisations).length > 0 && (
                                        <div className="item-customisations">
                                            {Object.entries(item.customisations).map(([groupId, data]) => (
                                                <div key={groupId} className="custom-line">
                                                    {data.groupName}: {data.options.map(opt => opt.name).join(', ')}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {item.remarks && (
                                        <div className="item-remarks">"{item.remarks}"</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button onClick={() => window.location.reload()} className="new-search-btn">
                            Search Another Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;