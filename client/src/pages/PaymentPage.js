import React, { useState } from 'react';
import { createOrder, processPayment, updateOrderStatus } from '../services/api';

function PaymentPage({ cartItems, user, onOrderComplete, onNavigate }) {
  const [address, setAddress] = useState('221B Baker Street, Tech City, NY 10001');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0 && !result) {
    return (
      <div className="status-container">
        <h2>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => onNavigate('products')}>
          Shop Products
        </button>
      </div>
    );
  }

  const handleCheckoutAndPay = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter a valid delivery address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const currentUserId = user ? user._id : 'guest-user-101';

      // 1. Create Order in Order Service (:5003)
      const orderPayload = {
        userId: currentUserId,
        products: cartItems.map((i) => ({
          productId: i.productId || i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        totalAmount: subtotal,
        address: address.trim()
      };

      const createdOrder = await createOrder(orderPayload);

      // 2. Process Payment Simulation in Payment Service (:5004)
      const paymentPayload = {
        orderId: createdOrder._id,
        userId: currentUserId,
        amount: subtotal,
        paymentMethod: paymentMethod
      };

      const paymentResponse = await processPayment(paymentPayload);

      // 3. If payment successful, update Order status in Order Service (:5003)
      if (paymentResponse.status === 'SUCCESS') {
        await updateOrderStatus(createdOrder._id, 'PAID');
      }

      setResult({
        order: createdOrder,
        payment: paymentResponse.payment,
        paymentStatus: paymentResponse.status
      });

      // Clear the shopping cart
      onOrderComplete();
    } catch (err) {
      setError(err.message || 'Payment simulation failed. Ensure Order and Payment services are up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout & Payment</h1>
      <p className="checkout-subtitle">
        Review your order and select your payment method.
      </p>

      {result ? (
        <div className="payment-result-card">
          <div className={`result-icon ${result.paymentStatus === 'SUCCESS' ? 'success' : 'failure'}`}>
            {result.paymentStatus === 'SUCCESS' ? '🎉' : '❌'}
          </div>
          <h2>
            {result.paymentStatus === 'SUCCESS'
              ? 'Order Placed & Payment Successful!'
              : 'Payment Failed'}
          </h2>

          <div className="result-details-box">
            <p><strong>Order ID:</strong> <code>{result.order._id}</code></p>
            <p><strong>Transaction ID:</strong> <code>{result.payment.transactionId || 'N/A'}</code></p>
            <p><strong>Amount Paid:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {result.payment.paymentMethod}</p>
            <p><strong>Payment Status:</strong> <span className="status-badge success">{result.paymentStatus}</span></p>
            <p><strong>Delivery Address:</strong> {address}</p>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('orders')}>
              View in Your Orders
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Left Form */}
          <div className="checkout-form-col">
            {error && <div className="alert-danger">{error}</div>}

            <form onSubmit={handleCheckoutAndPay}>
              {/* Step 1: Address */}
              <div className="checkout-step-card">
                <h3>1. Delivery Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Full Shipping Address</label>
                  <textarea
                    id="address"
                    className="form-control"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street, city, state, zip code..."
                    required
                  />
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="checkout-step-card">
                <h3>2. Select Payment Method</h3>
                <div className="payment-methods-group">
                  <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-info">
                      <span className="option-title">UPI (Google Pay, PhonePe, Paytm)</span>
                      <span className="option-sub">Fast, instant payment simulation</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'CARD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-info">
                      <span className="option-title">Credit / Debit Card</span>
                      <span className="option-sub">Visa, Mastercard, RuPay</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="option-info">
                      <span className="option-title">Cash on Delivery (COD)</span>
                      <span className="option-sub">Pay at doorstep upon arrival</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 3: Order Items Review */}
              <div className="checkout-step-card">
                <h3>3. Review Items ({cartItems.length})</h3>
                <div className="checkout-items-preview">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="preview-item">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-warning btn-block btn-pay-now"
                disabled={loading}
              >
                {loading ? 'Processing Order & Payment...' : `Place Your Order and Pay $${subtotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Right Summary Box */}
          <div className="checkout-summary-col">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Items Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping &amp; Handling:</span>
                <span className="free-tag">$0.00 (FREE)</span>
              </div>
              <hr className="divider" />
              <div className="summary-total-line">
                <span>Order Total:</span>
                <span className="summary-total-amount">${subtotal.toFixed(2)}</span>
              </div>
              <p className="summary-guarantee">
                🔒 Safe &amp; Secure 256-bit Simulated Payment
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
