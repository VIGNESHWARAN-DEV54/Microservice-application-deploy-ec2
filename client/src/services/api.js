import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shophub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// API Service Modules
export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
};

export const productService = {
  getProducts: (params) => API.get('/products', { params }),
  getFeaturedProducts: () => API.get('/products/featured'),
  getProductById: (id) => API.get(`/products/${id}`),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
  addReview: (id, reviewData) => API.post(`/products/${id}/reviews`, reviewData),
};

export const cartService = {
  getCart: () => API.get('/cart'),
  addToCart: (productId, quantity = 1) => API.post('/cart', { productId, quantity }),
  updateCartItem: (itemId, quantity) => API.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => API.delete(`/cart/${itemId}`),
  clearCart: () => API.delete('/cart'),
};

export const userService = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  addAddress: (addressData) => API.post('/users/addresses', addressData),
  deleteAddress: (addressId) => API.delete(`/users/addresses/${addressId}`),
  getWishlist: () => API.get('/users/wishlist'),
  addToWishlist: (productId) => API.post('/users/wishlist', { productId }),
  removeFromWishlist: (productId) => API.delete(`/users/wishlist/${productId}`),
};

export const orderService = {
  createOrder: (orderData) => API.post('/orders', orderData),
  getMyOrders: () => API.get('/orders/myorders'),
  getAllOrders: () => API.get('/orders'),
  getOrderById: (id) => API.get(`/orders/${id}`),
  payOrder: (id, paymentDetails) => API.put(`/orders/${id}/pay`, paymentDetails),
  updateOrderStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

export default API;
