require('dotenv').config()
const express = require('express')
const cors = require('cors')
const menuRoutes = require('./routes/menuRoutes')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/menu', menuRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})