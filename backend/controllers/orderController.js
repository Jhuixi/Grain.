const orderModel = require('../models/order');

const createOrder = async (req, res) => {
	try {
		const { items, guestName, userId } = req.body;
		// Validation
		if (!items || items.length === 0) {
			return res.status(400).json({ 
				success: false, 
				message: 'Order cannot be empty'
			});
		}
		
		if (!userId && (!guestName || !guestName.trim())) {
			return res.status(400).json({ 
				success: false, 
				message: 'Guest name is required' 
			});
		}
		
		const order = await orderModel.createOrder({
			userId: userId || null,
			guestName: userId ? null : guestName,
			// guestName: guestName,
			items: items
		});
		
		res.json({
			success: true,
			data: {
				orderId: order.orderId,
				orderNumber: order.orderNumber
			}
		});
		
	} catch (error) {
		console.error('Error in createOrder:', error);
		res.status(500).json({ 
			success: false, 
			message: 'Failed to create order',
			error: error.message 
		});
	}
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error in getOrder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order' 
    });
  }
};

const getUserOrders = async (req, res) => {
	try {
		const { userId } = req.params;
		const orders = await orderModel.getOrdersByUserId(userId);
		res.json({
			success: true,
			data: orders
		});
 	} catch (error) {
		console.error('Error in getUserOrders:', error);
		res.status(500).json({ 
			success: false, 
			message: 'Failed to fetch orders' 
		});
	}
};

module.exports = { 
	createOrder, 
	getOrder, 
	getUserOrders 
};