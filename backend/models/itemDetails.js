const pool = require('../config/db')

const getItemsDetails = async (category) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM menu_items 
      WHERE item_id = $item_id
      ORDER BY name
    `, [category])
    
    return result.rows
  } catch (error) {
    console.error('Error in getMenuItemsByCategory:', error)
    throw error
  }
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory
}