import React from 'react';

function ProductCard({ product, onAddToCart, onViewDetails }) {
  return (
    <div className="product-card">
      <div className="product-image-container" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
          }}
        />
        <span className="product-category-tag">{product.category}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title" onClick={() => onViewDetails(product)} title={product.name}>
          {product.name}
        </h3>

        <div className="product-rating">
          ⭐⭐⭐⭐⭐ <span className="rating-count">({Math.floor(Math.random() * 200 + 45)})</span>
        </div>

        <p className="product-desc-snippet">{product.description}</p>

        <div className="product-pricing">
          <span className="price-symbol">$</span>
          <span className="price-amount">{product.price.toFixed(2)}</span>
          {product.stock > 0 ? (
            <span className="stock-badge in-stock">In Stock ({product.stock})</span>
          ) : (
            <span className="stock-badge out-stock">Out of Stock</span>
          )}
        </div>

        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-add-cart"
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-secondary btn-details"
            onClick={() => onViewDetails(product)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
