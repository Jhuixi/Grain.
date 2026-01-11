const menuItem = require('../models/menuItem')

const getAllMenuItems = async (req, res) => {
  console.log('called')
  try {
    const items = await menuItem.getAllMenuItems()
    return res.status(200).json({ success: true, data: items })
  } catch (error) {
    console.error('Error in getAllMenuItems controller:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params
    const item = await menuItem.getMenuItemById(id)

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      })
    }

    return res.status(200).json({ success: true, data: item })
  } catch (error) {
    console.error('Error in getMenuItemById controller:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

const getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const items = await menuItem.getMenuItemsByCategory(category)

    return res.status(200).json({
      success: true,
      data: items,
      count: items.length
    })
  } catch (error) {
    console.error('Error in getMenuItemsByCategory controller:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory
}
