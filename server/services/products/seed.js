const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('../auth/node_modules/bcryptjs');

dotenv.config();

const MONGO_BASE = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  comparePrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, unique: true, required: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: { type: Array, default: [] },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// User Schema for Auth DB
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Exceptional sound quality with Hi-Res Audio and up to 30-hour battery life.',
    price: 349.99,
    comparePrice: 399.99,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 45,
    sku: 'SONY-WH1000XM5',
    rating: 4.8,
    numReviews: 42,
    isFeatured: true,
    tags: ['headphones', 'wireless', 'noise-cancelling', 'audio'],
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'Smartwatch with Always-On Retina display, S9 SiP chip, Double Tap gesture, and advanced health sensors for ECG, heart rate, and blood oxygen.',
    price: 429.00,
    comparePrice: 479.00,
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 30,
    sku: 'APPL-WATCH-S9',
    rating: 4.9,
    numReviews: 58,
    isFeatured: true,
    tags: ['smartwatch', 'fitness', 'apple', 'health'],
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Performance wireless mouse with 8K DPI any-surface tracking, quiet clicks, and ultra-fast MagSpeed electromagnetic scrolling.',
    price: 99.99,
    comparePrice: 119.99,
    category: 'Electronics',
    subcategory: 'Accessories',
    brand: 'Logitech',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 60,
    sku: 'LOGI-MXM3S',
    rating: 4.7,
    numReviews: 29,
    isFeatured: true,
    tags: ['mouse', 'productivity', 'wireless', 'ergonomic'],
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Compact mechanical keyboard with hot-swappable switches, per-key RGB backlighting, and durable PBT keycaps for gaming and coding.',
    price: 129.99,
    comparePrice: 159.99,
    category: 'Electronics',
    subcategory: 'Gaming',
    brand: 'Keychron',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 25,
    sku: 'KEY-RGB-PRO',
    rating: 4.6,
    numReviews: 18,
    isFeatured: false,
    tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
  },
  {
    name: 'Classic Minimalist Leather Backpack',
    description: 'Handcrafted premium full-grain leather backpack with padded 15-inch laptop compartment and water-resistant finish.',
    price: 189.50,
    comparePrice: 220.00,
    category: 'Fashion',
    subcategory: 'Bags',
    brand: 'NordicCraft',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 40,
    sku: 'NORD-LEATH-BP',
    rating: 4.8,
    numReviews: 14,
    isFeatured: true,
    tags: ['backpack', 'leather', 'fashion', 'travel'],
  },
  {
    name: 'Stainless Steel Insulated Water Bottle (32oz)',
    description: 'Double-wall vacuum insulation keeps drinks ice cold for 24 hours or hot for 12 hours. BPA-free with leak-proof straw lid.',
    price: 34.99,
    comparePrice: 44.99,
    category: 'Sports',
    subcategory: 'Fitness',
    brand: 'HydroLife',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 120,
    sku: 'HYDRO-32-BLK',
    rating: 4.9,
    numReviews: 67,
    isFeatured: false,
    tags: ['fitness', 'hydration', 'sports', 'outdoor'],
  },
  {
    name: 'Barista Touch Espresso Machine',
    description: 'Automated touch screen display with pre-programmed cafe drinks and automatic microfoam milk texturing for the perfect latte art.',
    price: 799.00,
    comparePrice: 899.00,
    category: 'Home & Kitchen',
    subcategory: 'Appliances',
    brand: 'Breville',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 15,
    sku: 'BREV-BAR-TOUCH',
    rating: 4.9,
    numReviews: 31,
    isFeatured: true,
    tags: ['coffee', 'espresso', 'kitchen', 'home'],
  },
  {
    name: 'Urban Canvas Running Sneakers',
    description: 'Lightweight, breathable mesh runners with responsive foam cushioning and high-traction rubber outsole.',
    price: 89.99,
    comparePrice: 110.00,
    category: 'Fashion',
    subcategory: 'Footwear',
    brand: 'Stride',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 75,
    sku: 'STRIDE-URBAN-RD',
    rating: 4.6,
    numReviews: 24,
    isFeatured: true,
    tags: ['sneakers', 'running', 'shoes', 'athletic'],
  },
];

async function seedDatabase() {
  try {
    console.log('--- Starting Database Seeder ---');

    // 1. Seed Products
    const productsConn = await mongoose.createConnection(`${MONGO_BASE}/ecommerce_products`).asPromise();
    const Product = productsConn.model('Product', productSchema);

    await Product.deleteMany({});
    console.log('Cleared existing products in ecommerce_products.');

    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products!`);
    await productsConn.close();

    // 2. Seed Users
    const authConn = await mongoose.createConnection(`${MONGO_BASE}/ecommerce_auth`).asPromise();
    const User = authConn.model('User', userSchema);

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    await User.deleteMany({ email: { $in: ['admin@shophub.com', 'demo@shophub.com', 'test@example.com'] } });

    await User.create([
      {
        firstName: 'Admin',
        lastName: 'Manager',
        email: 'admin@shophub.com',
        password: adminPassword,
        role: 'admin',
        phone: '+1 555-0100',
        isVerified: true,
      },
      {
        firstName: 'Demo',
        lastName: 'Customer',
        email: 'demo@shophub.com',
        password: userPassword,
        role: 'customer',
        phone: '+1 555-0199',
        isVerified: true,
      },
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: userPassword,
        role: 'customer',
        phone: '+1 555-0188',
        isVerified: true,
      },
    ]);

    console.log('Successfully seeded demo users (admin@shophub.com / admin123, demo@shophub.com / user123)!');
    await authConn.close();

    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
}

seedDatabase();
