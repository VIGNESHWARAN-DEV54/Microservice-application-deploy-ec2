import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Orders from './pages/Orders';
import PaymentPage from './pages/PaymentPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { fetchProducts, searchProducts } from './services/api';
import './App.css';

function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('amazon_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Shopping Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('amazon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Products Data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('amazon_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('amazon_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('amazon_user');
    }
  }, [user]);

  // Load products from Product Service
  const loadProducts = useCallback(async (cat = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts(cat);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed connecting to store server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory, loadProducts]);

  // Search handler
  const handleSearch = async (term) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCategory('');
      setCurrentView('products');
      const results = await searchProducts(term);
      setProducts(results);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product._id);
      if (existing) {
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // View Details
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth operations
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // Checkout navigation
  const handleProceedToCheckout = () => {
    if (!user) {
      // Direct to login first or allow checkout
      setCurrentView('payment');
    } else {
      setCurrentView('payment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-layout">
      <Navbar
        user={user}
        onLogout={handleLogout}
        cartCount={totalCartCount}
        onSearch={handleSearch}
        currentCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="main-content">
        {currentView === 'home' && (
          <Home
            products={products}
            loading={loading}
            error={error}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onNavigate={setCurrentView}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {currentView === 'products' && (
          <Products
            products={products}
            loading={loading}
            error={error}
            category={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentView === 'details' && (
          <ProductDetails
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentView}
            onProceedToBuyNow={() => {
              setCurrentView('payment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={handleProceedToCheckout}
            onClearCart={handleClearCart}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'payment' && (
          <PaymentPage
            cartItems={cart}
            user={user}
            onOrderComplete={handleClearCart}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'orders' && (
          <Orders user={user} onNavigate={setCurrentView} />
        )}

        {currentView === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'register' && (
          <Register
            onLoginSuccess={handleLoginSuccess}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
