import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!user) {
      // Load local cart if unauthenticated
      const local = localStorage.getItem('shophub_local_cart');
      if (local) {
        try {
          setCartItems(JSON.parse(local));
        } catch (e) {
          setCartItems([]);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();
      const cartData = response.data.cart || response.data.items || response.data || [];
      // Normalize items
      const items = Array.isArray(cartData) ? cartData : (cartData.items || []);
      setCartItems(items);
    } catch (err) {
      console.warn('Could not fetch cart from server:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save to local storage if user is not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('shophub_local_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id;
    if (user) {
      try {
        await cartService.addToCart(productId, quantity);
        await fetchCart();
        addToast(`Added "${product.name}" to cart`, 'success');
        setIsCartOpen(true);
      } catch (err) {
        addToast(err.message || 'Failed to add item to cart', 'error');
      }
    } else {
      // Local cart logic
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => (item.product?._id || item.product?.id || item._id || item.id) === productId
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [...prev, { _id: Date.now().toString(), product, quantity }];
        }
      });
      addToast(`Added "${product.name}" to cart`, 'success');
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      return removeFromCart(itemId);
    }
    if (user) {
      try {
        await cartService.updateCartItem(itemId, newQty);
        await fetchCart();
      } catch (err) {
        addToast(err.message || 'Failed to update quantity', 'error');
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        await cartService.removeFromCart(itemId);
        await fetchCart();
        addToast('Item removed from cart', 'info');
      } catch (err) {
        addToast(err.message || 'Failed to remove item', 'error');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      addToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart();
        setCartItems([]);
      } catch (err) {
        console.warn('Failed to clear cart on server:', err.message);
      }
    }
    setCartItems([]);
    localStorage.removeItem('shophub_local_cart');
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
