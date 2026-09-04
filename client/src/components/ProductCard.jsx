import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);

  const productId = product._id || product.id;
  const isSaved = isInWishlist(productId);

  // Fallback image generator based on category/title
  const getFallbackImage = () => {
    return `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60`;
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.25)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }}
    >
      {/* Product Image & Overlays */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%', /* 4:3 Aspect Ratio */
          backgroundColor: '#0f172a',
          overflow: 'hidden',
        }}
      >
        <img
          src={imgError || !product.image ? getFallbackImage() : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Category Tag */}
        <span
          className="badge badge-brand"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backdropFilter: 'blur(8px)',
          }}
        >
          {product.category || 'General'}
        </span>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSaved ? '#f43f5e' : '#cbd5e1',
            transition: 'all 0.2s ease',
          }}
        >
          <Heart size={16} fill={isSaved ? '#f43f5e' : 'none'} />
        </button>

        {/* Quick View Floating Button */}
        <button
          onClick={() => onQuickView(product)}
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Eye size={14} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Details Body */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Rating & Stock Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                {product.rating || 4.5}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                ({product.numReviews || product.reviews?.length || 12})
              </span>
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                color: (product.countInStock ?? 10) > 0 ? '#34d399' : '#fb7185',
                fontWeight: 500,
              }}
            >
              {(product.countInStock ?? 10) > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Product Name */}
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.3,
              marginBottom: '0.4rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p
            style={{
              fontSize: '0.82rem',
              color: '#94a3b8',
              lineHeight: 1.4,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description || 'Premium quality product crafted with precision and excellence.'}
          </p>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            marginTop: '0.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Price</span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              ${Number(product.price || 0).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={(product.countInStock ?? 10) <= 0}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              opacity: (product.countInStock ?? 10) <= 0 ? 0.5 : 1,
            }}
          >
            <ShoppingBag size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
