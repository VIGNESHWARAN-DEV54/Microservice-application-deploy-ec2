import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { X, PackageCheck, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';

const OrderHistoryModal = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        addToast(err.message || 'Failed to load order history', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [addToast]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <PackageCheck size={24} color="#818cf8" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Your Orders</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '0.85rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                      Order ID: {order._id}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                      Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`badge ${order.isPaid ? 'badge-emerald' : 'badge-rose'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <span className="badge badge-brand">
                      {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: '#f8fafc' }}>
                        {item.qty}x {item.name}
                      </span>
                      <span style={{ color: '#94a3b8' }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                    fontSize: '0.9rem',
                  }}
                >
                  <span style={{ color: '#94a3b8' }}>Total Amount</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                    ${Number(order.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryModal;
