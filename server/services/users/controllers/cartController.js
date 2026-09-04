const Cart = require('../models/Cart');

const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:5002';

// Helper to populate product data via HTTP from Products Microservice
async function populateCartProducts(cart) {
  if (!cart) return null;
  const cartObj = cart.toObject ? cart.toObject() : JSON.parse(JSON.stringify(cart));
  if (!cartObj.items || cartObj.items.length === 0) return cartObj;

  cartObj.items = await Promise.all(
    cartObj.items.map(async (item) => {
      try {
        const prodId = item.product?._id || item.product;
        const res = await fetch(`${PRODUCTS_SERVICE_URL}/api/products/${prodId}`);
        if (res.ok) {
          const prodData = await res.json();
          item.product = prodData;
        }
      } catch (err) {
        console.error('Failed to fetch product for cart item:', err.message);
      }
      return item;
    })
  );

  return cartObj;
}

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const populatedCart = await populateCartProducts(cart);
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity, price }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Item exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity, price });
      }
    }

    await cart.save();
    const populatedCart = await populateCartProducts(cart);

    res.status(200).json({ message: 'Item added to cart', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await populateCartProducts(cart);
    res.status(200).json({ message: 'Cart updated', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    const populatedCart = await populateCartProducts(cart);

    res.status(200).json({ message: 'Item removed from cart', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
