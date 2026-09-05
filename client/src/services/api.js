// Helper to dynamically use the current browser hostname (supports localhost and EC2 public IP)
const getBaseUrl = (envUrl, port) => {
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:${port}`;
  }
  return envUrl || `http://localhost:${port}`;
};

const PRODUCT_URL = getBaseUrl(process.env.REACT_APP_PRODUCT_SERVICE_URL, 5001);
const USER_URL = getBaseUrl(process.env.REACT_APP_USER_SERVICE_URL, 5002);
const ORDER_URL = getBaseUrl(process.env.REACT_APP_ORDER_SERVICE_URL, 5003);
const PAYMENT_URL = getBaseUrl(process.env.REACT_APP_PAYMENT_SERVICE_URL, 5004);

// ===================== PRODUCT SERVICE =====================
export const fetchProducts = async (category = '') => {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${PRODUCT_URL}/api/products${query}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${PRODUCT_URL}/api/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

export const searchProducts = async (name) => {
  if (!name.trim()) return fetchProducts();
  const res = await fetch(`${PRODUCT_URL}/api/products/search/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Failed searching products');
  return res.json();
};

export const seedSampleProducts = async () => {
  const res = await fetch(`${PRODUCT_URL}/api/products/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to seed products');
  return res.json();
};

// ===================== USER SERVICE =====================
export const registerUser = async (userData) => {
  const res = await fetch(`${USER_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${USER_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const fetchUserProfile = async (userId) => {
  const res = await fetch(`${USER_URL}/api/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
};

// ===================== ORDER SERVICE =====================
export const createOrder = async (orderData) => {
  const res = await fetch(`${ORDER_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create order');
  return data;
};

export const fetchOrders = async (userId = '') => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${ORDER_URL}/api/orders${query}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const fetchOrderById = async (orderId) => {
  const res = await fetch(`${ORDER_URL}/api/orders/${orderId}`);
  if (!res.ok) throw new Error('Failed to fetch order details');
  return res.json();
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${ORDER_URL}/api/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
};

// ===================== PAYMENT SERVICE =====================
export const processPayment = async (paymentData) => {
  const res = await fetch(`${PAYMENT_URL}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Payment failed');
  return data;
};

export const fetchPaymentById = async (paymentId) => {
  const res = await fetch(`${PAYMENT_URL}/api/payments/${paymentId}`);
  if (!res.ok) throw new Error('Failed to fetch payment details');
  return res.json();
};
