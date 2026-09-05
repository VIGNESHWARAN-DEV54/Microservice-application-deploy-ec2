require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/users';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'user-service',
    status: 'UP',
    port: PORT,
    timestamp: new Date()
  });
});

// Mount User Routes
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log(`[User Service] Connected to MongoDB at ${MONGO_URL}`);
  })
  .catch((err) => {
    console.error(`[User Service] MongoDB connection error:`, err.message);
  });

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[User Service] Server running on port ${PORT}`);
});
