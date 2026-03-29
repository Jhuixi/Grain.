const orderModel = require('../models/order');

const createOrder = async (req, res) => {
	try {
		const { items, guestName } = req.body;
		// Validation
		if (!items || items.length === 0) {
			return res.status(400).json({ 
				success: false, 
				message: 'Order cannot be empty'
			});
		}
		
		// if (!userId && (!guestName || !guestName.trim())) {
		if (!guestName || !guestName.trim()) {
			return res.status(400).json({ 
				success: false, 
				message: 'Guest name is required' 
			});
		}
		
		const order = await orderModel.createOrder({
			userId: null, 
			// guestName: !userId ? guestName : null,
			guestName: guestName,
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

// Get order details
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

module.exports = { createOrder, getOrder };