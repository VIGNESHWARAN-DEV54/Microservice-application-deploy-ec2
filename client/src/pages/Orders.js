import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../services/api';

function Orders({ user, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch user's orders if logged in, otherwise fetch all recent orders for demo
      const data = await fetchOrders(user ? user._id : '');
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve orders from Order Service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(`Error updating order status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1 className="page-title">Your Orders</h1>
          <p className="page-subtitle">Track and view your recent purchases</p>
        </div>
        <button className="btn btn-outline" onClick={loadOrders}>
          🔄 Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="status-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="status-container error-state">
          <p className="error-title">⚠️ Could not load orders</p>
          <p className="error-msg">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="status-container empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders placed yet</h2>
          <p>Looks like you haven't placed any orders. Start browsing our catalog!</p>
          <button className="btn btn-primary" onClick={() => onNavigate('products')}>
            Shop Products Now
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-header-info">
                  <div className="order-meta-col">
                    <span className="meta-label">ORDER PLACED</span>
                    <span className="meta-val">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-meta-col">
                    <span className="meta-label">TOTAL</span>
                    <span className="meta-val">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="meta-label">SHIP TO</span>
                    <span className="meta-val" title={order.address}>
                      {order.address.length > 25 ? order.address.substring(0, 25) + '...' : order.address}
                    </span>
                  </div>
                </div>
                <div className="order-header-id">
                  <span className="meta-label">ORDER # {order._id}</span>
                  <span className={`status-pill status-${order.status ? order.status.toLowerCase() : 'pending'}`}>
                    {order.status || 'PENDING'}
                  </span>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-items-sublist">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="order-item-detail">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-item-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80?text=Item';
                          }}
                        />
                      )}
                      <div className="order-item-desc">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity} &middot; Price: ${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-actions-col">
                  <span className="action-hint">Update status:</span>
                  <div className="status-update-buttons">
                    {['PAID', 'SHIPPED', 'DELIVERED'].map((st) => (
                      <button
                        key={st}
                        className={`btn-tag ${order.status === st ? 'active' : ''}`}
                        disabled={updatingId === order._id || order.status === st}
                        onClick={() => handleStatusChange(order._id, st)}
                      >
                        Mark as {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
