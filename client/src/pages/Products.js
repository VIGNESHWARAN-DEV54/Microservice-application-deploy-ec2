import React from 'react';
import ProductList from '../components/ProductList';

function Products({ products, loading, error, category, onSelectCategory, onAddToCart, onViewDetails }) {
  const categories = ['All', 'Computers', 'Mobiles', 'Audio', 'Accessories', 'Wearables', 'Cameras'];

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {category ? `${category} Products` : 'All Products Catalog'}
          </h1>
          <p className="page-subtitle">
            Showing {products.length} products
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${((cat === 'All' && !category) || category === cat) ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat === 'All' ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ProductList
        products={products}
        loading={loading}
        error={error}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}

export default Products;
