const path = require('path');
const dotenv = require('dotenv');

// Load env vars immediately
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Products service is running' });
});

const PORT = process.env.PORT || process.env.PRODUCTS_PORT || 5002;

app.listen(PORT, () => {
  console.log(`Products service running on port ${PORT}`);
});
