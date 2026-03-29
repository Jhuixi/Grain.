const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

//------------------------------ Routes -----------------------------------
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/menu', menuRoutes); 
app.use('/api/createOrder', orderRoutes);


app.listen(port, () => {
    console.log(`!!! Server running on port ${port}`);
});