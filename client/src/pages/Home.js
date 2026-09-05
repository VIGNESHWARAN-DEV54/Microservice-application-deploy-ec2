import React from 'react';
import ProductList from '../components/ProductList';

function Home({ products, loading, error, onAddToCart, onViewDetails, onNavigate, onSelectCategory }) {
  return (
    <div className="home-page">
      {/* Amazon-style Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">Featured Deals</span>
          <h1 className="hero-title">Shop Latest Electronics & Tech Gadgets</h1>
          <p className="hero-subtitle">
            Explore exclusive offers on premium laptops, mobile devices, audio gear, and computer accessories with lightning-fast delivery.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-large" onClick={() => onNavigate('products')}>
              Shop All Products
            </button>
            <button className="btn btn-outline btn-large" onClick={() => onNavigate('orders')}>
              Track Orders
            </button>
          </div>
        </div>
      </div>

      {/* Category Fast Cards */}
      <div className="category-cards-grid">
        <div className="category-card" onClick={() => { onSelectCategory('Computers'); onNavigate('products'); }}>
          <h3>Computers & Laptops</h3>
          <p>High performance notebooks & screens</p>
          <span className="card-link">Shop now →</span>
        </div>
        <div className="category-card" onClick={() => { onSelectCategory('Mobiles'); onNavigate('products'); }}>
          <h3>Smartphones</h3>
          <p>5G flagship and mid-range devices</p>
          <span className="card-link">Shop now →</span>
        </div>
        <div className="category-card" onClick={() => { onSelectCategory('Audio'); onNavigate('products'); }}>
          <h3>Audio & Headphones</h3>
          <p>Noise cancelling, speakers & earbuds</p>
          <span className="card-link">Shop now →</span>
        </div>
        <div className="category-card" onClick={() => { onSelectCategory('Accessories'); onNavigate('products'); }}>
          <h3>PC Accessories</h3>
          <p>Keyboards, mice, and peripherals</p>
          <span className="card-link">Shop now →</span>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="section-featured">
        <div className="section-header">
          <h2>Featured Products</h2>
          <button className="btn-link" onClick={() => onNavigate('products')}>
            View All ({products.length}) →
          </button>
        </div>

        <ProductList
          products={products}
          loading={loading}
          error={error}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      </section>
    </div>
  );
}

export default Home;
