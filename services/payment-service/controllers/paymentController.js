const Payment = require('../models/Payment');

// Create payment simulation
exports.createPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, paymentMethod } = req.body;

    if (!orderId || !userId || amount === undefined || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required payment fields' });
    }

    const validMethods = ['UPI', 'CARD', 'COD'];
    const formattedMethod = paymentMethod.toUpperCase();
    if (!validMethods.includes(formattedMethod)) {
      return res.status(400).json({ message: 'Invalid payment method. Use UPI, CARD, or COD.' });
    }

    // Payment simulation logic:
    // Any amount <= 0 fails; otherwise simulate 98% success rate or explicit simulation
    const status = Number(amount) > 0 ? 'SUCCESS' : 'FAILED';

    const newPayment = new Payment({
      orderId,
      userId,
      amount: Number(amount),
      paymentMethod: formattedMethod,
      status
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      message: status === 'SUCCESS' ? 'Payment processed successfully' : 'Payment failed',
      status: savedPayment.status,
      payment: savedPayment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error finding payment', error: error.message });
  }
};
