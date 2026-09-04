const Profile = require('../models/Profile');
const Wishlist = require('../models/Wishlist');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.userId || req.user.id });

    if (!profile) {
      profile = await Profile.create({
        user: req.user.userId || req.user.id,
        addresses: [],
      });
    }

    res.status(200).json({
      success: true,
      profile,
      user: {
        id: req.user.userId || req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { phone, bio, avatar, newsletterSubscribed } = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({ user: userId });
    }

    if (phone !== undefined) profile.phone = phone;
    if (bio !== undefined) profile.bio = bio;
    if (avatar !== undefined) profile.avatar = avatar;
    if (newsletterSubscribed !== undefined) profile.newsletterSubscribed = newsletterSubscribed;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
};

// @desc    Add shipping address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId, addresses: [] });
    }

    if (isDefault) {
      profile.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    profile.addresses.push({
      street,
      city,
      state,
      zipCode,
      country: country || 'US',
      isDefault: isDefault || profile.addresses.length === 0,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: profile.addresses,
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Failed to add address', error: error.message });
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { addressId } = req.params;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.addresses = profile.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: profile.addresses,
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const alreadyInWishlist = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(400).json({ message: 'Product is already in wishlist' });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Failed to add to wishlist', error: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId && item._id.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist,
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove from wishlist', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
