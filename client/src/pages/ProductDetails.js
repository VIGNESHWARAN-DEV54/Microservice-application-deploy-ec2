import React, { useState } from 'react';

function ProductDetails({ product, onAddToCart, onNavigate, onProceedToBuyNow }) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  if (!product) {
    return (
      <div className="status-container">
        <h2>No Product Selected</h2>
        <button className="btn btn-primary" onClick={() => onNavigate('products')}>
          Browse Products
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    if (onProceedToBuyNow) {
      onProceedToBuyNow();
    } else {
      onNavigate('cart');
    }
  };

  return (
    <div className="product-details-page">
      <button className="btn-back" onClick={() => onNavigate('products')}>
        ← Back to products
      </button>

      <div className="details-container">
        {/* Left: Product Image */}
        <div className="details-image-col">
          <img
            src={product.image}
            alt={product.name}
            className="details-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x400?text=Product+Image';
            }}
          />
        </div>

        {/* Middle: Product Info */}
        <div className="details-info-col">
          <span className="details-category">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          <div className="product-rating">
            ⭐⭐⭐⭐⭐ <span className="rating-count">4.8 out of 5 stars (142 ratings)</span>
          </div>

          <hr className="divider" />

          <div className="details-price-row">
            <span className="price-label">Price:</span>
            <span className="price-symbol">$</span>
            <span className="price-large">{product.price.toFixed(2)}</span>
            <span className="tax-inclusive">Inclusive of all taxes</span>
          </div>

          <div className="details-desc-box">
            <h4>About this item:</h4>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Right: Buy / Add to Cart Box */}
        <div className="details-buy-box">
          <div className="buy-card">
            <div className="buy-price">${(product.price * quantity).toFixed(2)}</div>
            <p className="delivery-time">FREE Delivery available by tomorrow.</p>

            {product.stock > 0 ? (
              <p className="stock-label in-stock">In Stock ({product.stock} units available)</p>
            ) : (
              <p className="stock-label out-stock">Currently unavailable</p>
            )}

            {product.stock > 0 && (
              <div className="quantity-select-row">
                <label htmlFor="qty-select">Quantity:</label>
                <select
                  id="qty-select"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="qty-dropdown"
                >
                  {[...Array(Math.min(product.stock, 10)).keys()].map((n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {addedMessage && (
              <div className="alert-success">
                ✅ Added {quantity} item(s) to Cart!
              </div>
            )}

            <button
              className="btn btn-primary btn-block"
              disabled={product.stock <= 0}
              onClick={handleAdd}
            >
              Add to Cart
            </button>

            <button
              className="btn btn-warning btn-block"
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
