const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/myorders', authMiddleware, getMyOrders);
router.get('/', authMiddleware, isAdmin, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/pay', authMiddleware, updateOrderToPaid);
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
