require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5004;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/payments';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'payment-service',
    status: 'UP',
    port: PORT,
    timestamp: new Date()
  });
});

// Mount Payment Routes
app.use('/api/payments', paymentRoutes);

// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log(`[Payment Service] Connected to MongoDB at ${MONGO_URL}`);
  })
  .catch((err) => {
    console.error(`[Payment Service] MongoDB connection error:`, err.message);
  });

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Payment Service] Server running on port ${PORT}`);
});
