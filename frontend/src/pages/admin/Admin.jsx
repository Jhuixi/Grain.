import { useState, useEffect } from 'react';
import { 
  Container, Sidebar, Content, Panel, Badge, Loader, Message, Tag, 
  Stack, Divider, SelectPicker, useToaster, Notification, Button, 
  Pagination, Nav, Whisper, Tooltip, IconButton, CustomProvider
} from 'rsuite';
import '../../styles/Admin.css'

const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const pageSize = 10;
    const toaster = useToaster();

    const statusOptions = [
        { label: 'All Orders', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }
    ];

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, currentPage]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5001/api/admin/orders?status=${statusFilter}&page=${currentPage}&limit=${pageSize}`
            );
            const data = await response.json();
            if (data.success) {
                setOrders(data.data.orders);
                setTotalPages(data.data.pagination.totalPages);
                setTotalOrders(data.data.pagination.total);
                
                if (data.data.orders.length > 0 && !selectedOrder) {
                    const firstOrder = data.data.orders[0];
                    setSelectedOrder(firstOrder);
                    fetchOrderDetails(firstOrder.order_id);
                }
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

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/details`);
            const data = await response.json();
            if (data.success) {
                setSelectedOrderDetails(data.data);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                await fetchOrders();
                if (selectedOrder?.order_id === orderId) {
                    await fetchOrderDetails(orderId);
                }
                toaster.push(
                    <Notification type="success" header="Status Updated" closable>
                        Order #{orderId} status changed to {newStatus}
                    </Notification>, 
                    { placement: 'topCenter', duration: 3000 }
                );
            }
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Update Failed" closable>
                    Failed to update order status
                </Notification>, 
                { placement: 'topCenter', duration: 3000 }
            );
        }
    };

    const handleStatusAction = async () => {
        if (!selectedOrderDetails) return;
        let newStatus = selectedOrderDetails.status === 'pending' ? 'preparing' : 'completed';
        await updateOrderStatus(selectedOrderDetails.order_id, newStatus);
    };

    const getStatusColor = (status) => {
        const colors = { 'pending': 'orange', 'preparing': 'blue', 'completed': 'green', 'cancelled': 'red' };
        return colors[status] || 'gray';
    };

    const getStatusText = (status) => {
        const texts = { 'pending': 'Pending', 'preparing': 'Preparing', 'completed': 'Completed', 'cancelled': 'Cancelled' };
        return texts[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-SG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const handleOrderSelect = (orderId) => {
        const order = orders.find(o => o.order_id === orderId);
        if (order) {
            setSelectedOrder(order);
            fetchOrderDetails(orderId);
        }
    };

    if (loading && orders.length === 0) {
        return <Loader center size="lg" content="Loading orders..." vertical />;
    }

    if (error) {
        return <Message showIcon type="error" header="Error" style={{ margin: 20 }}>{error}</Message>;
    }

    const getActionButton = () => {
        if (!selectedOrderDetails) return null;
        if (selectedOrderDetails.status === 'pending') {
            return (
                <Button appearance="primary" color="orange" size="lg" block onClick={handleStatusAction}>
                    Confirm Order →
                </Button>
            );
        }
        if (selectedOrderDetails.status === 'preparing') {
            return (
                <Button appearance="primary" color="green" size="lg" block onClick={handleStatusAction}>
                    Order Completed →
                </Button>
            );
        }
        return null;
    };

    return (
        <CustomProvider>
            <Container style={{ height: '100vh' }}>
                <Sidebar style={{ width: 600, borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 20, borderBottom: '1px solid #e5e5e5' }}>
                        <Stack justifyContent="space-between">
                            <h4>Orders</h4>
                            <Badge content={totalOrders} style={{ background: '#5a9c6e' }} />
                        </Stack>
                    </div>
                    
                    <div style={{ padding: 12}}>
                        <SelectPicker
                            data={statusOptions}
                            value={statusFilter}
                            onChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                            style={{ width: '100%' }}
                            cleanable={false}
                            searchable={false}
                            block
                        />
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                        {orders.map((order) => (
                            <div
                                key={order.order_id}
                                onClick={() => handleOrderSelect(order.order_id)}
                                style={{
                                    padding: 12,
                                    marginBottom: 8,
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    background: selectedOrder?.order_id === order.order_id ? '#f0f9ff' : 'white',
                                    border: selectedOrder?.order_id === order.order_id ? '1px solid #3498ff' : '1px solid #e5e5e5',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedOrder?.order_id !== order.order_id) {
                                        e.currentTarget.style.background = '#f5f5f5';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedOrder?.order_id !== order.order_id) {
                                        e.currentTarget.style.background = 'white';
                                    }
                                }}
                            >
                                <Stack justifyContent="space-between" style={{ marginBottom: 8 }}>
                                    <strong>#{order.order_id}</strong>
                                    <Tag color={getStatusColor(order.status)} size="sm">
                                        {getStatusText(order.status)}
                                    </Tag>
                                </Stack>
                                <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                                    {order.customer_name}
                                </div>
                                <div style={{ fontSize: 11, color: '#999' }}>
                                    {formatDate(order.order_date)}
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <Message showIcon type="info" style={{ marginTop: 20 }}>No orders found</Message>
                        )}
                    </div>
                    
                    {totalPages > 1 && (
                        <div style={{ padding: 12, borderTop: '1px solid #e5e5e5' }}>
                            <Pagination
                                pages={totalPages}
                                activePage={currentPage}
                                onSelect={setCurrentPage}
                                size="sm"
                                layout={['pager']}
                                maxButtons={5}
                            />
                        </div>
                    )}
                </Sidebar>

                <Content style={{ padding: 20, overflowY: 'auto' }}>
                    {selectedOrderDetails ? (
                        <Panel bordered style={{ background: 'white' }}>
                            <Stack justifyContent="space-between" style={{ marginBottom: 16 }}>
                                <h3>Order #{selectedOrderDetails.order_id}</h3>
                                <Tag color={getStatusColor(selectedOrderDetails.status)} size="md">
                                    {getStatusText(selectedOrderDetails.status)}
                                </Tag>
                            </Stack>
                            
                            <Divider />
                            
                            <div style={{ marginTop: 15 ,marginBottom: 8 }}>
                                <h5 style={{ marginTop: 2 ,marginBottom: 5 }}>Customer Information</h5>
                                <p><strong>Name:</strong> {selectedOrderDetails.customer_name}</p>
                                <p><strong>Order Date:</strong> {formatDate(selectedOrderDetails.order_date)}</p>
                                {selectedOrderDetails.completed_date && (
                                    <p><strong>Completed:</strong> {formatDate(selectedOrderDetails.completed_date)}</p>
                                )}
                            </div>

                            <Divider />

                            <div>
                                <h5 style={{ marginBottom: 12 }}>Order Items</h5>
                                {selectedOrderDetails.items?.map((item, idx) => (
                                    <Panel key={idx} bordered style={{ marginBottom: 12, background: '#fafafa' }}>
                                        <strong>{item.quantity}× {item.item_name}</strong>
                                        {item.customisations && Object.keys(item.customisations).length > 0 && (
                                            <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
                                                {Object.entries(item.customisations).map(([groupId, data]) => (
                                                    <div key={groupId}>
                                                        • {data.groupName}: {data.options.map(opt => opt.name).join(', ')}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {item.remarks && (
                                            <div style={{ marginTop: 8, fontSize: 12, color: '#888', fontStyle: 'italic' }}>
                                                Remarks: {item.remarks}
                                            </div>
                                        )}
                                    </Panel>
                                ))}
                            </div>
                            
                            <Divider />
                            
                            {getActionButton()}
                        </Panel>
                    ) : (
                        <Panel bordered style={{ textAlign: 'center', padding: 60 }}>
                            <Message showIcon type="info" header="No Order Selected">
                                Select an order from the sidebar to view details
                            </Message>
                        </Panel>
                    )}
                </Content>
            </Container>
        </CustomProvider>
    );
};

export default Admin;