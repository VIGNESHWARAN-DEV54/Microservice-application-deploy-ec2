import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch, RefreshCw } from 'lucide-react';

const ProductGrid = ({ products, loading, onQuickView, onResetFilters }) => {
  if (loading) {
    return (
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto 4rem',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="glass-panel"
            style={{
              height: '380px',
              borderRadius: '16px',
              animation: 'pulse 1.5s infinite ease-in-out',
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
            }}
          />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          maxWidth: '1280px',
          margin: '3rem auto 6rem',
          padding: '3rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '3rem 2rem',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PackageSearch size={32} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
            No Products Found
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '360px' }}>
            We couldn't find any items matching your search criteria or category filter.
          </p>
          <button className="btn-secondary" onClick={onResetFilters} style={{ marginTop: '0.5rem' }}>
            <RefreshCw size={16} />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto 4rem',
        padding: '0 1.5rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
