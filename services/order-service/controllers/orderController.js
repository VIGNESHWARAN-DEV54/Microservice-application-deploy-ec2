const Order = require('../models/Order');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, address } = req.body;

    if (!userId || !products || !products.length || totalAmount === undefined || !address) {
      return res.status(400).json({ message: 'Missing required order details' });
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount: Number(totalAmount),
      address,
      status: 'PENDING'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get all orders (with optional ?userId=... filter)
exports.getAllOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error finding order', error: error.message });
  }
};

// Update order status or details
exports.updateOrder = async (req, res) => {
  try {
    const { status, address } = req.body;
    const updateData = {};
    if (status) updateData.status = status.toUpperCase();
    if (address) updateData.address = address;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order', error: error.message });
  }
};
