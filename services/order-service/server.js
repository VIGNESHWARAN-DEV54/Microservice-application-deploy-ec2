require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5003;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/orders';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'order-service',
    status: 'UP',
    port: PORT,
    timestamp: new Date()
  });
});

// Mount Order Routes
app.use('/api/orders', orderRoutes);

// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log(`[Order Service] Connected to MongoDB at ${MONGO_URL}`);
  })
  .catch((err) => {
    console.error(`[Order Service] MongoDB connection error:`, err.message);
  });

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Order Service] Server running on port ${PORT}`);
});
