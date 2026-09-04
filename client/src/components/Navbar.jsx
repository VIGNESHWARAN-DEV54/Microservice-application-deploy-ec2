import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  LogOut,
  Sparkles,
  ShieldAlert,
  PackageCheck,
  X,
} from 'lucide-react';

const Navbar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onOpenAuth,
  onOpenOrders,
  onOpenAdmin,
}) => {
  const { user, logout, isAdmin } = useAuth();
  const { setIsCartOpen, cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'Electronics', label: 'Electronics' },
    { id: 'Fashion', label: 'Fashion & Apparel' },
    { id: 'Home & Kitchen', label: 'Home & Living' },
    { id: 'Books', label: 'Books' },
    { id: 'Sports', label: 'Sports & Outdoors' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Top Row: Brand, Search, Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Brand Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
              }}
            >
              <ShoppingBag color="#ffffff" size={22} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Shop<span style={{ color: '#818cf8' }}>Hub</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginTop: '-3px',
                }}
              >
                Microservices Edition
              </span>
            </div>
          </div>

          {/* Live Search Input */}
          <div
            style={{
              flex: 1,
              maxWidth: '520px',
              position: 'relative',
            }}
          >
            <Search
              size={18}
              color="#94a3b8"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search products by name, description, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '42px',
                paddingRight: searchTerm ? '40px' : '16px',
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                color: '#f8fafc',
                fontSize: '0.9rem',
                height: '42px',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Wishlist Button */}
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <Heart size={18} color={wishlist.length > 0 ? '#f43f5e' : '#cbd5e1'} fill={wishlist.length > 0 ? '#f43f5e' : 'none'} />
                <span className="hidden-sm">Saved</span>
                {wishlist.length > 0 && (
                  <span
                    style={{
                      background: '#f43f5e',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      padding: '1px 6px',
                    }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              <ShoppingBag size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span
                  style={{
                    background: '#ffffff',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    borderRadius: '9999px',
                    padding: '2px 7px',
                    lineHeight: 1,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            <div style={{ position: 'relative' }}>
              {user ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                      }}
                    >
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span>{user.name?.split(' ')[0] || 'User'}</span>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '120%',
                        width: '210px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          padding: '8px 12px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          marginBottom: '4px',
                        }}
                      >
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                          {user.name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', truncate: true }}>
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenOrders();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          color: '#cbd5e1',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <PackageCheck size={16} color="#818cf8" />
                        My Orders
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            onOpenAdmin();
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            color: '#cbd5e1',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <ShieldAlert size={16} color="#f59e0b" />
                          Admin Console
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          color: '#fb7185',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '4px',
                        }}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <User size={16} color="#818cf8" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Category Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: active ? 600 : 500,
                  whiteSpace: 'nowrap',
                  backgroundColor: active
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: active ? '#818cf8' : '#94a3b8',
                  border: active
                    ? '1px solid rgba(99, 102, 241, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
