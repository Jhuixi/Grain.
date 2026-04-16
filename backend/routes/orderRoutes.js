const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.get('/user/:userId', authenticate, orderController.getUserOrders);

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);

module.exports = router;