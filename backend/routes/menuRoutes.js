const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/test', (req, res) => {
  res.json({ message: 'Route working' });
});

router.get('/category/:category', menuController.getMenuItemsByCategory);
router.get('/:id/customisations', menuController.getItemCustomisations);

router.get('/:id', menuController.getMenuItemById);
router.get('/', menuController.getAllMenuItems);

module.exports = router;