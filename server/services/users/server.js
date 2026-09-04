const path = require('path');
const dotenv = require('dotenv');

// Load env vars immediately
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Users service is running' });
});

const PORT = process.env.PORT || process.env.USERS_PORT || 5003;

app.listen(PORT, () => {
  console.log(`Users service running on port ${PORT}`);
});

