const express = require('express');
require('dotenv').config();
require('./config/database');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Logistics App API is running!',
        version: '1.0.0',
        endpoints: {
            users: '/api/user',
            orders: '/api/order'
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});