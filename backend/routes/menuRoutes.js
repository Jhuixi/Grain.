const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// /api/menu
router.get('/', menuController.getAllMenuItems)
router.get('/:id', menuController.getMenuItemById)
router.get('/category/:category', menuController.getMenuItemsByCategory)

module.exports = router;