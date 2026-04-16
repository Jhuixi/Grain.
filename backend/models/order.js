const pool = require('../config/db');

const createOrder = async (orderData) => {
    const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const orderResult = await client.query(`
			INSERT INTO orders (user_id, guest_name, status, order_date)
			VALUES ($1, $2, 'pending', NOW())
			RETURNING order_id
		`, [orderData.userId, orderData.guestName]);
		
		const orderId = orderResult.rows[0].order_id;
		for (const item of orderData.items) {
			await client.query(`
				INSERT INTO order_items (order_id, item_id, quantity, remarks, customisations)
				VALUES ($1, $2, $3, $4, $5)
			`, [ orderId, item.item_id, item.quantity, item.remarks, JSON.stringify(item.customisations)]
			);
		}
		
		await client.query('COMMIT');
		
		return { 
			orderId: orderId, 
			orderNumber: orderId
		};
		
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error creating order:', error);
		throw error;
    } finally {
      	client.release();
    }
};

const getOrderById = async (orderId) => {
  	try {
		const orderResult = await pool.query(`
			SELECT 
				o.order_id,
				o.user_id,
				o.guest_name,
				o.status,
				o.order_date,
				o.completed_date,
				u.username as registered_username
			FROM orders o
			LEFT JOIN users u ON o.user_id = u.user_id
			WHERE o.order_id = $1
		`, [orderId]);
		
		if (orderResult.rows.length === 0) return null;
		
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
		`, [orderId]);
		
		const order = orderResult.rows[0];
		const customerName = order.guest_name || order.registered_username;
		
		return {
			orderId: order.order_id,
			customerName: customerName,
			status: order.status,
			orderDate: order.order_date,
			completedDate: order.completed_date,
			items: itemsResult.rows.map(item => ({
				...item,
				customisations: item.customisations 
			}))
		};
    
	} catch (error) {
		console.error('Error getting order:', error);
		throw error;
	}
};

const getOrdersByUserId = async (userId) => {
	console.log(userId)
	const result = await pool.query(`
		SELECT 
			order_id,
			status,
			order_date,
			completed_date
		FROM orders 
		WHERE user_id = $1
		ORDER BY order_date DESC
	`, [userId]);
	
	return result.rows;
};

module.exports = { 
	createOrder, 
	getOrderById,
	getOrdersByUserId
};