const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Address routes
router.post('/addresses', addAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;
