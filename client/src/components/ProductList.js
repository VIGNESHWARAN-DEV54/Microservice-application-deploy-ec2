import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, loading, error, onAddToCart, onViewDetails }) {
  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error-state">
        <p className="error-title">⚠️ Unable to load products</p>
        <p className="error-msg">{error}</p>
        <p className="error-hint">Please check back in a few moments.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="status-container empty-state">
        <p className="empty-title">📦 No Products Found</p>
        <p>There are no products currently available in this category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default ProductList;
