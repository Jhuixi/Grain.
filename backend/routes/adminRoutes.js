const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/verify', adminController.verifyPin);
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id/details', adminController.getOrderDetails); 
router.put('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;