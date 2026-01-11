const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const menuRoutes = require('./routes/menuRoutes');

// Use routes - this handles ALL /api/menu requests
app.use('/api/menu', menuRoutes); 

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server working' });
});

// Optional: Add database connection test route
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require('./config/db');
    await pool.query('SELECT 1');
    res.json({ status: 'OK', message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Menu endpoint: http://localhost:${port}/api/menu`);
  console.log(`📍 Health check: http://localhost:${port}/api/health`);
});