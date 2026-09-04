import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out forwards',
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#090d16',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#818cf8" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Your Shopping Cart</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ color: '#94a3b8', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Indicator */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              marginBottom: '6px',
            }}
          >
            <span>
              {cartTotal >= freeShippingThreshold ? (
                <strong style={{ color: '#34d399' }}>🎉 You unlocked Free Express Shipping!</strong>
              ) : (
                `Add $${(freeShippingThreshold - cartTotal).toFixed(2)} more for FREE shipping`
              )}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #34d399)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#64748b',
                gap: '1rem',
              }}
            >
              <ShoppingBag size={48} color="#334155" />
              <p style={{ fontSize: '1rem', color: '#94a3b8' }}>Your cart is empty</p>
              <button
                className="btn-secondary"
                onClick={() => setIsCartOpen(false)}
                style={{ fontSize: '0.85rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => {
                const prod = item.product || item;
                const itemId = item._id || item.id || prod._id;
                const price = prod.price || item.price || 0;
                return (
                  <div
                    key={itemId}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '0.85rem',
                    }}
                  >
                    <img
                      src={
                        prod.image ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={prod.name}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        backgroundColor: '#0f172a',
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#ffffff',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {prod.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(itemId)}
                          style={{ color: '#64748b', padding: '2px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                          ${Number(price).toFixed(2)}
                        </span>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            borderRadius: '6px',
                            padding: '2px 6px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            style={{ color: '#94a3b8' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            style={{ color: '#94a3b8' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                style={{
                  alignSelf: 'center',
                  fontSize: '0.78rem',
                  color: '#fb7185',
                  marginTop: '0.5rem',
                }}
              >
                Clear Cart Items
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <span>Subtotal</span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <span>Shipping</span>
              <span style={{ color: cartTotal >= freeShippingThreshold ? '#34d399' : '#ffffff', fontWeight: 600 }}>
                {cartTotal >= freeShippingThreshold ? 'FREE' : '$10.00'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#ffffff',
                borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
                paddingTop: '0.75rem',
              }}
            >
              <span>Total</span>
              <span className="gradient-text">
                ${(cartTotal + (cartTotal >= freeShippingThreshold ? 0 : 10)).toFixed(2)}
              </span>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem' }}
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
