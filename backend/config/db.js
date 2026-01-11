const { Pool } = require('pg')
require('dotenv').config()

console.log('Database connection details:')
console.log('Host:', process.env.DB_HOST)
console.log('Port:', process.env.DB_PORT)
console.log('Database:', process.env.DB_NAME)
console.log('User:', process.env.DB_USER)

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection FAILED:', err)
  } else {
    console.log('Database connected successfully at:', res.rows[0].now)
  }
})

module.exports = pool