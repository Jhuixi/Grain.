const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

//------------------------------ Routes -----------------------------------
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes')

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes); 
app.use('/api/orders', orderRoutes);


app.listen(port, () => {
    console.log(`!!! Server running on port ${port}`);
});