const menuItem = require('../models/menuItem')

const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await menuItem.getAllMenuItems()
    res.json(menuItems)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllMenuItems
}