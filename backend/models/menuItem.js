const pool = require('./db')

const getAllMenuItems = async () => {
  try {
    const result = await pool.query('SELECT * FROM menu_items')
    return result.rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllMenuItems
}