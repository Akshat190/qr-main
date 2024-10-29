const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const menuItemRoutes = require('./routes/menuItems');
const orderRoutes = require('./routes/orders');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
