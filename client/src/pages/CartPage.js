import React from 'react';
import Cart from '../components/Cart';

function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout, onClearCart, onNavigate }) {
  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-nav">
        <button className="btn-back" onClick={() => onNavigate('products')}>
          ← Continue Shopping
        </button>
      </div>

      <Cart
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onProceedToCheckout={onProceedToCheckout}
        onClearCart={onClearCart}
      />
    </div>
  );
}

export default CartPage;
