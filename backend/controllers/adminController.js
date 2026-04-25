const pool = require('../config/db');

const getAllOrders = async (req, res) => {
  try {
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = '';
    const queryParams = [];
    
    if (status && status !== 'all') {
      whereClause = 'WHERE o.status = $1';
      queryParams.push(status);
    }
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM orders o
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    // Get paginated orders
    const ordersQuery = `
      SELECT 
        o.order_id,
        o.user_id,
        o.guest_name,
        o.status,
        o.order_date,
        o.completed_date,
        COALESCE(o.guest_name, u.username) as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      ${whereClause}
      ORDER BY 
        CASE WHEN o.status = 'pending' THEN 1 
             WHEN o.status = 'preparing' THEN 2 
             ELSE 3 END,
        o.order_date DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    const ordersParams = [...queryParams, limit, offset];
    const ordersResult = await pool.query(ordersQuery, ordersParams);
    
    res.json({ 
      success: true, 
      data: {
        orders: ordersResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
    
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order with customer info
    const orderResult = await pool.query(`
      SELECT 
        o.order_id,
        o.user_id,
        o.guest_name,
        o.status,
        o.order_date,
        o.completed_date,
        COALESCE(o.guest_name, u.username) as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = $1
    `, [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Get order items
    const itemsResult = await pool.query(`
      SELECT 
        oi.order_item_id,
        oi.item_id,
        oi.quantity,
        oi.remarks,
        oi.customisations,
        m.name as item_name,
        m.category,
        m.image_url
      FROM order_items oi
      JOIN menu_items m ON oi.item_id = m.item_id
      WHERE oi.order_id = $1
    `, [id]);
    
    const order = orderResult.rows[0];
    order.items = itemsResult.rows.map(item => ({
      ...item,
      customisations: item.customisations || {}
    }));
    
    res.json({ success: true, data: order });
    
  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order details',
      error: error.message 
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const completedDate = status === 'completed' ? new Date() : null;
    
    const result = await pool.query(`
      UPDATE orders 
      SET status = $1, completed_date = $2
      WHERE order_id = $3
      RETURNING order_id, status, completed_date
    `, [status, completedDate, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ 
      success: true, 
      data: result.rows[0],
      message: `Order #${id} status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update order status',
      error: error.message 
    });
  }
};

const verifyPin = async (req, res) => {
    try {
        const { pin } = req.body;
        const adminPin = process.env.ADMIN_PIN || '000000'; 
        
        if (pin === adminPin) {
            res.json({ success: true, message: 'PIN verified' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid PIN' });
        }
    } catch (error) {
        console.error('Error verifying PIN:', error);
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
};

module.exports = { 
  getAllOrders, 
  getOrderDetails,
  updateOrderStatus,
  verifyPin
};