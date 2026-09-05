import React from 'react';

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout, onClearCart }) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-panel">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your Shopping Cart is empty</h2>
        <p>Explore our electronics catalog and add some awesome tech gadgets to your cart!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <div className="cart-header-row">
          <h1 className="cart-title">Shopping Cart</h1>
          <button className="btn-text-danger" onClick={onClearCart}>Clear Cart</button>
        </div>
        <p className="price-header-label">Price</p>
        <hr className="divider" />

        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item-row">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100?text=Item';
                }}
              />
              <div className="cart-item-details">
                <h4 className="cart-item-name">{item.name}</h4>
                <p className="cart-item-stock in-stock">In Stock</p>
                <div className="cart-qty-controls">
                  <span className="qty-label">Qty:</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                  <span className="pipe-sep">|</span>
                  <button
                    className="btn-delete"
                    onClick={() => onRemoveItem(item.productId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-subtotal-footer">
          Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'}):{' '}
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
      </div>

      {/* Checkout Sidebar Summary */}
      <div className="cart-summary-sidebar">
        <div className="summary-card">
          <div className="free-shipping-note">
            <span>✅</span>
            <span>Your order qualifies for <strong>FREE Delivery</strong></span>
          </div>
          <div className="summary-total-line">
            <span>Subtotal ({totalCount} items):</span>
            <span className="summary-total-amount">${subtotal.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary btn-block btn-checkout"
            onClick={onProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
