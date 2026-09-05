const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Order ID is required']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'CARD', 'COD'],
    required: [true, 'Payment method must be UPI, CARD, or COD']
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    default: 'SUCCESS'
  },
  transactionId: {
    type: String,
    default: () => 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase()
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
