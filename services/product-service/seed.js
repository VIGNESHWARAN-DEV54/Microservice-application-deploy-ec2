require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const seedProducts = require('./seedData.json');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/products';

async function seedDB() {
  try {
    console.log(`Connecting to MongoDB at: ${mongoUrl}`);
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected.');

    await Product.deleteMany({});
    console.log('Existing products cleared.');

    const docs = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${docs.length} products!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seedDB();
