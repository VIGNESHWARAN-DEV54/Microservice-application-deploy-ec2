import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      const local = localStorage.getItem('shophub_local_wishlist');
      if (local) {
        try {
          setWishlist(JSON.parse(local));
        } catch (e) {
          setWishlist([]);
        }
      }
      return;
    }
    try {
      const res = await userService.getWishlist();
      const items = res.data.wishlist || res.data || [];
      setWishlist(items);
    } catch (err) {
      console.warn('Could not fetch wishlist from backend:', err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('shophub_local_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    const exists = wishlist.some(
      (item) => (item._id || item.id || item.product?._id) === productId
    );

    if (exists) {
      if (user) {
        try {
          await userService.removeFromWishlist(productId);
          setWishlist((prev) =>
            prev.filter((item) => (item._id || item.id || item.product?._id) !== productId)
          );
        } catch (err) {
          addToast(err.message || 'Failed to remove from wishlist', 'error');
        }
      } else {
        setWishlist((prev) =>
          prev.filter((item) => (item._id || item.id || item.product?._id) !== productId)
        );
      }
      addToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      if (user) {
        try {
          await userService.addToWishlist(productId);
          setWishlist((prev) => [...prev, product]);
        } catch (err) {
          addToast(err.message || 'Failed to add to wishlist', 'error');
        }
      } else {
        setWishlist((prev) => [...prev, product]);
      }
      addToast(`Saved "${product.name}" to wishlist`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id || item.product?._id) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
