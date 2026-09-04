const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:5002';
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://localhost:5003';
const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL || 'http://localhost:5004';

// Proxy configuration
const proxyOptions = {
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: fixRequestBody,
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({
      message: 'Service temporarily unavailable',
      error: err.message,
    });
  },
};

// Health check for gateway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'API Gateway is running',
    services: {
      auth: AUTH_SERVICE_URL,
      products: PRODUCTS_SERVICE_URL,
      users: USERS_SERVICE_URL,
      orders: ORDERS_SERVICE_URL,
    },
  });
});

// Route to Auth Service
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    ...proxyOptions,
  })
);

// Route to Products Service
app.use(
  '/api/products',
  createProxyMiddleware({
    target: PRODUCTS_SERVICE_URL,
    ...proxyOptions,
  })
);

// Route to Users Service (Cart)
app.use(
  '/api/cart',
  createProxyMiddleware({
    target: USERS_SERVICE_URL,
    ...proxyOptions,
  })
);

// Route to Users Service (Profile, Wishlist, User Management)
app.use(
  '/api/users',
  createProxyMiddleware({
    target: USERS_SERVICE_URL,
    ...proxyOptions,
  })
);

// Route to Orders Service
app.use(
  '/api/orders',
  createProxyMiddleware({
    target: ORDERS_SERVICE_URL,
    ...proxyOptions,
  })
);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || process.env.GATEWAY_PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Service Routes:');
  console.log(`  - Auth Service: ${AUTH_SERVICE_URL}`);
  console.log(`  - Products Service: ${PRODUCTS_SERVICE_URL}`);
  console.log(`  - Users Service (Cart & Profile): ${USERS_SERVICE_URL}`);
  console.log(`  - Orders Service: ${ORDERS_SERVICE_URL}`);
});
