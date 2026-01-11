const pool = require('../config/db')

const getAllMenuItems = async () => {
  try {
    const result = await pool.query(`
      SELECT * FROM menu_items 
      WHERE qty != 0
      ORDER BY category, item_id
    `)
    return result.rows
  } catch (error) {
    console.error('Error in getAllMenuItems:', error)
    throw error
  }
}

const getMenuItemById = async (itemId) => {
  try {
    const result = await pool.query(`
      SELECT * FROM menu_items 
      WHERE item_id = $1 AND qty != 0
    `, [itemId])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error in getMenuItemById:', error)
    throw error
  }
}

const getMenuItemsByCategory = async (category) => {
  try {
    const result = await pool.query(`
      SELECT item_id, name, description, category, image_url, price, available
      FROM menu_items 
      WHERE category = $1 AND qty != 0
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