require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/products';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'product-service',
    status: 'UP',
    port: PORT,
    timestamp: new Date()
  });
});

// Mount Product Routes
app.use('/api/products', productRoutes);

// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log(`[Product Service] Connected to MongoDB at ${MONGO_URL}`);
  })
  .catch((err) => {
    console.error(`[Product Service] MongoDB connection error:`, err.message);
  });

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Product Service] Server running on port ${PORT}`);
});
