import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/api';
import { X, CreditCard, ShieldCheck, CheckCircle2, Truck, Lock } from 'lucide-react';

const CheckoutModal = ({ onClose, onOrderPlaced }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [address, setAddress] = useState('124 Innovation Way, Tech Park');
  const [city, setCity] = useState('San Francisco');
  const [postalCode, setPostalCode] = useState('94105');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [placingOrder, setPlacingOrder] = useState(false);

  const shippingPrice = cartTotal >= 100 ? 0 : 10;
  const totalPrice = cartTotal + shippingPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please sign in to place an order', 'error');
      return;
    }

    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    try {
      setPlacingOrder(true);

      const orderItems = cartItems.map((item) => {
        const p = item.product || item;
        return {
          name: p.name,
          qty: item.quantity,
          image: p.image,
          price: p.price || item.price,
          product: p._id || p.id,
        };
      });

      const orderPayload = {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice,
        taxPrice: 0,
        totalPrice,
      };

      const res = await orderService.createOrder(orderPayload);
      const createdOrder = res.data;

      // Simulate instant payment success
      if (createdOrder._id) {
        await orderService.payOrder(createdOrder._id, {
          id: `PAY-${Date.now()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: user.email,
        });
      }

      addToast('Order placed & paid successfully!', 'success');
      clearCart();
      onClose();
      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      addToast(err.message || 'Failed to place order', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '24px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#94a3b8',
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Secure Checkout
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Left Column: Address & Payment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} />
                  <span>1. Shipping Address</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} />
                  <span>2. Payment Method</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Credit Card', 'PayPal', 'UPI / Wallet', 'Cash on Delivery'].map((method) => (
                    <label
                      key={method}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: paymentMethod === method ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                        border: paymentMethod === method ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
                  Order Summary ({cartItems.length} items)
                </h3>

                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {cartItems.map((item, idx) => {
                    const p = item.product || item;
                    return (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: '#cbd5e1' }}>
                          {item.quantity}x {p.name}
                        </span>
                        <span style={{ color: '#ffffff', fontWeight: 600 }}>
                          ${((p.price || item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Items Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                    <span>Shipping</span>
                    <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '8px' }}>
                    <span>Total Amount</span>
                    <span className="gradient-text">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <Lock size={16} />
                  <span>{placingOrder ? 'Processing Order...' : `Pay $${totalPrice.toFixed(2)} & Place Order`}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
