import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productService } from '../services/api';
import { X, Star, ShoppingBag, ShieldCheck, Truck, Send } from 'lucide-react';

const ProductDetailModal = ({ product, onClose, onReviewAdded }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  if (!product) return null;

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please sign in to post a review', 'info');
      return;
    }
    try {
      setSubmittingReview(true);
      await productService.addReview(product._id || product.id, { rating, comment });
      addToast('Thank you! Review submitted successfully.', 'success');
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      addToast(err.message || 'Failed to post review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '24px',
          position: 'relative',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: '#94a3b8',
            padding: '6px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Product Image Showcase */}
          <div>
            <div
              style={{
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                aspectRatio: '4/3',
              }}
            >
              <img
                src={
                  product.image ||
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
                }
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1rem',
                fontSize: '0.82rem',
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} color="#818cf8" />
                <span>Fast Express Shipping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#34d399" />
                <span>1 Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-brand" style={{ marginBottom: '0.75rem' }}>
                {product.category || 'General'}
              </span>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {product.name}
              </h2>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      color="#f59e0b"
                      fill={(product.rating || 4.5) >= star ? '#f59e0b' : 'none'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                  {product.rating || 4.5} rating
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  ({product.numReviews || product.reviews?.length || 12} reviews)
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  ${Number(product.price || 0).toFixed(2)}
                </span>
              </div>

              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}
              >
                {product.description ||
                  'Experience top-tier quality designed for performance, comfort, and durability.'}
              </p>

              {/* Quantity Selector & Add to Cart */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Qty:</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Add ${Number(product.price * quantity).toFixed(2)} to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Customer Reviews ({product.reviews?.length || 0})
          </h3>

          {/* Add Review Form */}
          <form
            onSubmit={handleAddReview}
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '1.5rem',
            }}
          >
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Write a Review
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{ color: rating >= star ? '#f59e0b' : '#475569' }}
                >
                  <Star size={18} fill={rating >= star ? '#f59e0b' : 'none'} />
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Share your thoughts about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                style={{ flex: 1, fontSize: '0.88rem' }}
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
              >
                <Send size={16} />
                <span>Submit</span>
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                      {rev.name || 'Verified Customer'}
                    </span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          color="#f59e0b"
                          fill={rev.rating >= s ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                No reviews yet. Be the first to share your opinion!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
