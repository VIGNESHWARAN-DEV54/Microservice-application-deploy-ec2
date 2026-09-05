const Product = require('../models/Product');
const seedProducts = require('../seedData.json');

// Get all products (with optional ?category=... filter)
exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: new RegExp(`^${category}$`, 'i') } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products', error: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error finding product', error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    if (!name || !description || price === undefined || !image || !category) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      image,
      category,
      stock: stock !== undefined ? Number(stock) : 10
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

// Search products by name
exports.searchProducts = async (req, res) => {
  try {
    const { name } = req.params;
    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

// Seed sample products into database
exports.seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(seedProducts);
    res.status(201).json({
      message: 'Sample products seeded successfully',
      count: inserted.length,
      products: inserted
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to seed products', error: error.message });
  }
};
