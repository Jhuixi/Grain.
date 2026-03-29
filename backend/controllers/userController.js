const pool = require('../config/db');

const createGuestUser = async (guestName) => {
  const result = await pool.query(`
    INSERT INTO users (username, user_type)
    VALUES ($1, 'guest')
    RETURNING user_id
  `, [guestName]);
  
  return { user_id: result.rows[0].user_id };
};

const getOrCreateGuestUser = async (guestName) => {
  const existing = await pool.query(`
    SELECT user_id FROM users 
    WHERE username = $1 AND user_type = 'guest'
  `, [guestName]);
  
  if (existing.rows.length > 0) {
    return { user_id: existing.rows[0].user_id };
  }
  
  return await createGuestUser(guestName);
};

module.exports = { 
    createGuestUser, 
    getOrCreateGuestUser 
};