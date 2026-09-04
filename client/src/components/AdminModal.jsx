import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { X, ShieldAlert, Plus, Package, ListOrdered, CheckCircle2 } from 'lucide-react';

const AdminModal = ({ onClose, onProductCreated }) => {
  const [activeTab, setActiveTab] = useState('new-product');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [countInStock, setCountInStock] = useState('20');
  const [submitting, setSubmitting] = useState(false);

  const [allOrders, setAllOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    if (activeTab === 'all-orders') {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          const res = await orderService.getAllOrders();
          setAllOrders(res.data || []);
        } catch (err) {
          addToast(err.message || 'Failed to fetch admin orders', 'error');
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, addToast]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await productService.createProduct({
        name,
        price: Number(price),
        description,
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
        category,
        countInStock: Number(countInStock),
      });
      addToast(`Product "${name}" created successfully!`, 'success');
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      if (onProductCreated) onProductCreated();
    } catch (err) {
      addToast(err.message || 'Failed to create product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
      setAllOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <ShieldAlert size={24} color="#f59e0b" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Console</h2>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setActiveTab('new-product')}
            style={{
              paddingBottom: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'new-product' ? '#818cf8' : '#64748b',
              borderBottom: activeTab === 'new-product' ? '2px solid #818cf8' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => setActiveTab('all-orders')}
            style={{
              paddingBottom: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'all-orders' ? '#818cf8' : '#64748b',
              borderBottom: activeTab === 'all-orders' ? '2px solid #818cf8' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ListOrdered size={16} />
            <span>Manage All Orders</span>
          </button>
        </div>

        {activeTab === 'new-product' ? (
          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyberpunk Wireless Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="299.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Image URL (Unsplash or CDN link)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Detailed description of features and specs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ padding: '0.85rem', marginTop: '0.5rem' }}
            >
              <span>{submitting ? 'Creating Product...' : 'Publish Product to Catalog'}</span>
            </button>
          </form>
        ) : (
          <div>
            {loadingOrders ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                Loading system orders...
              </p>
            ) : allOrders.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No orders recorded yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {allOrders.map((ord) => (
                  <div
                    key={ord._id}
                    style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.4)',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                        Order #{ord._id}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Customer ID: {ord.user || 'Guest'} | Total: ${Number(ord.totalPrice).toFixed(2)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Status:</span>
                      <select
                        value={ord.status || 'Pending'}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;
