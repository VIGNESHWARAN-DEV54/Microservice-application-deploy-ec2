import React, { useState } from 'react';

function Navbar({ user, onLogout, cartCount, onSearch, currentCategory, onSelectCategory, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const categories = ['All', 'Computers', 'Mobiles', 'Audio', 'Accessories', 'Wearables', 'Cameras'];

  return (
    <header className="header">
      {/* Top Main Navigation Bar */}
      <div className="navbar-main">
        {/* Amazon Logo Brand */}
        <div className="nav-brand" onClick={() => { setSearchTerm(''); onSelectCategory(''); onNavigate('home'); }}>
          <span className="brand-title">amazon<span className="brand-dot">.clone</span></span>
        </div>

        {/* Global Product Search */}
        <form className="nav-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search Amazon products (e.g. Laptop, Headphones, Watch)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn" title="Search">
            🔍
          </button>
        </form>

        {/* Action Links */}
        <div className="nav-actions">
          {/* User Account / Auth */}
          {user ? (
            <div className="nav-item user-menu">
              <span className="nav-line-1">Hello, {user.name}</span>
              <div className="nav-line-2">
                <span className="nav-bold">Account</span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="nav-item" onClick={() => onNavigate('login')}>
              <span className="nav-line-1">Hello, sign in</span>
              <span className="nav-line-2 nav-bold">Accounts & Lists</span>
            </div>
          )}

          {/* Orders Link */}
          <div className="nav-item" onClick={() => onNavigate('orders')}>
            <span className="nav-line-1">Returns</span>
            <span className="nav-line-2 nav-bold">& Orders</span>
          </div>

          {/* Cart Icon & Count */}
          <div className="nav-item nav-cart" onClick={() => onNavigate('cart')}>
            <div className="cart-icon-container">
              <span className="cart-icon">🛒</span>
              <span className="cart-badge">{cartCount}</span>
            </div>
            <span className="nav-bold cart-label">Cart</span>
          </div>
        </div>
      </div>

      {/* Secondary Category Subnav */}
      <div className="navbar-sub">
        <div className="category-links">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${((cat === 'All' && !currentCategory) || currentCategory === cat) ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory(cat === 'All' ? '' : cat);
                onNavigate('products');
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
