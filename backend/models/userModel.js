const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (username, email, password) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	const result = await pool.query(
		`INSERT INTO users (username, email, password_hash, created_at) 
			VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
			RETURNING user_id, username, email`, [username, email, hashedPassword]
	);
	return result.rows[0];
};

const findUserByEmail = async (email) => {
	const result = await pool.query(
		`SELECT user_id, username, email, password_hash, created_at FROM users WHERE email = $1`, [email]
	);
	return result.rows[0];
};

const findUserById = async (userId) => {
	const result = await pool.query(
		`SELECT user_id, username, email, created_at FROM users WHERE user_id = $1`, [userId]
	);
	return result.rows[0];
};

module.exports = { 
	createUser, 
	findUserByEmail, 
	findUserById 
};