const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    await mongoose.connect(`${mongoURI}/ecommerce_products`);
    console.log('MongoDB connected successfully to ecommerce_products');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
