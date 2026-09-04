import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import ToastContainer from './components/ToastContainer';
import { productService } from './services/api';

// Curated Seed Fallback Products (in case backend DB is empty)
const DEMO_PRODUCTS = [
  {
    _id: 'demo-1',
    name: 'CyberAcoustic Noise-Canceling Headphones',
    price: 249.99,
    description: 'Immersive spatial audio with active noise cancellation, 40-hour battery life, and ultra-soft memory foam ear cushions.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.9,
    numReviews: 48,
    countInStock: 15,
  },
  {
    _id: 'demo-2',
    name: 'NeoGlow Mechanical Gaming Keyboard',
    price: 139.50,
    description: 'Custom hot-swappable tactile switches, per-key RGB backlighting, aircraft-grade aluminum frame, and wireless Bluetooth 5.2.',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.8,
    numReviews: 32,
    countInStock: 8,
  },
  {
    _id: 'demo-3',
    name: 'AeroPulse Smart Health Watch',
    price: 199.00,
    description: 'Continuous ECG monitor, SpO2 sensor, sapphire crystal touchscreen, GPS tracking, and 50m water resistance.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 4.7,
    numReviews: 29,
    countInStock: 20,
  },
  {
    _id: 'demo-4',
    name: 'Quantum Optics Pro Camera Lens',
    price: 799.99,
    description: 'Ultra-fast f/1.4 aperture, nano-ar coating for ghosting suppression, weather-sealed titanium body for professional photographers.',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&auto=format&fit=crop&q=80',
    category: 'Electronics',
    rating: 5.0,
    numReviews: 14,
    countInStock: 5,
  },
  {
    _id: 'demo-5',
    name: 'Minimalist Artisan Leather Backpack',
    price: 165.00,
    description: 'Full-grain Italian leather, padded 16-inch laptop compartment, hidden anti-theft pocket, and ergonomic shoulder straps.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    category: 'Fashion',
    rating: 4.6,
    numReviews: 21,
    countInStock: 12,
  },
  {
    _id: 'demo-6',
    name: 'Lumina Smart Ambient Desk Lamp',
    price: 89.99,
    description: 'Adaptive color temperature control, built-in Qi fast wireless charging base, and touch-sensitive dimming slider.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    category: 'Home & Kitchen',
    rating: 4.8,
    numReviews: 19,
    countInStock: 25,
  },
];

const MainAppContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal States
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      const loaded = res.data.products || res.data || [];
      if (Array.isArray(loaded) && loaded.length > 0) {
        setProducts(loaded);
      } else {
        setProducts(DEMO_PRODUCTS);
      }
    } catch (err) {
      console.warn('Backend products offline/empty, using demo catalog:', err.message);
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side Filter Logic
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main style={{ flex: 1 }}>
        <HeroSection
          onExploreClick={() => {
            const gridEl = document.getElementById('catalog-grid');
            gridEl?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <div id="catalog-grid">
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto 1.5rem',
              padding: '0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {selectedCategory === 'all' ? 'All Catalog Products' : selectedCategory}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Showing {filteredProducts.length} items
              </p>
            </div>
          </div>

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onResetFilters={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'rgba(9, 13, 22, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ color: '#cbd5e1', fontWeight: 600, marginBottom: '0.5rem' }}>
            ShopHub Microservices Platform
          </p>
          <p>© 2026 ShopHub Inc. Node.js & React Powered Architecture.</p>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onReviewAdded={fetchProducts}
        />
      )}

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}

      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onOrderPlaced={() => setIsOrdersOpen(true)}
        />
      )}

      {isOrdersOpen && <OrderHistoryModal onClose={() => setIsOrdersOpen(false)} />}

      {isAdminOpen && (
        <AdminModal
          onClose={() => setIsAdminOpen(false)}
          onProductCreated={fetchProducts}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainAppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
