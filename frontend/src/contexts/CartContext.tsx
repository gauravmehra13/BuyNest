import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product; selectedSize?: string; selectedColor?: string; cartItemId?: string; quantity?: number }
  | { type: 'REMOVE_FROM_CART'; cartItemId: string }
  | { type: 'UPDATE_QUANTITY'; cartItemId: string; quantity: number }
  | { type: 'UPDATE_SELECTION'; cartItemId: string; selectedSize?: string; selectedColor?: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_CART'; items: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.items };

    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item =>
        item.product._id === action.product._id &&
        item.selectedSize === action.selectedSize &&
        item.selectedColor === action.selectedColor
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product._id === action.product._id &&
              item.selectedSize === action.selectedSize &&
              item.selectedColor === action.selectedColor
              ? { ...item, quantity: item.quantity + (action.quantity || 1) }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, {
          _id: action.cartItemId || `temp-${action.product._id}`,
          product: action.product,
          quantity: action.quantity || 1,
          selectedSize: action.selectedSize,
          selectedColor: action.selectedColor
        }]
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.cartItemId)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map(item =>
            item._id === action.cartItemId
              ? { ...item, quantity: action.quantity }
              : item
          )
          .filter(item => item.quantity > 0)
      };

    case 'UPDATE_SELECTION':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.cartItemId
            ? { ...item, selectedSize: action.selectedSize, selectedColor: action.selectedColor }
            : item
        )
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Load cart on auth change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartItems = await api.getCart();
        dispatch({ type: 'SET_CART', items: cartItems });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    if (authState.isAuthenticated) {
      fetchData();
    } else {
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      dispatch({ type: 'SET_CART', items: guestCart });
    }
  }, [authState.isAuthenticated]);

  // Save guest cart in localStorage when not logged in
  useEffect(() => {
    if (!authState.isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    }
  }, [state.items, authState.isAuthenticated]);

  // Merge guest cart into backend on login
  useEffect(() => {
    const mergeGuestCart = async () => {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      if (guestCart.length) {
        for (const item of guestCart) {
          await api.addToCart(item.product._id, item.quantity, item.selectedSize, item.selectedColor);
        }
        localStorage.removeItem('guestCart');
      }
    };
    if (authState.isAuthenticated) {
      mergeGuestCart();
    }
  }, [authState.isAuthenticated]);

  // Sync functions
  const syncAddToCart = async (product: Product, selectedSize?: string, selectedColor?: string) => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'ADD_TO_CART', product, selectedSize, selectedColor });
      return;
    }
    try {
      const newItem = await api.addToCart(product._id, 1, selectedSize, selectedColor);
      dispatch({ type: 'ADD_TO_CART', product, selectedSize, selectedColor, cartItemId: newItem._id });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const syncRemoveFromCart = async (cartItemId: string) => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'REMOVE_FROM_CART', cartItemId });
      return;
    }
    try {
      await api.removeFromCart(cartItemId);
      dispatch({ type: 'REMOVE_FROM_CART', cartItemId });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const syncUpdateQuantity = async (cartItemId: string, quantity: number) => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'UPDATE_QUANTITY', cartItemId, quantity });
      return;
    }
    try {
      await api.updateCartItem(cartItemId, quantity);
      dispatch({ type: 'UPDATE_QUANTITY', cartItemId, quantity });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const syncUpdateSelection = async (cartItemId: string, selectedSize?: string, selectedColor?: string) => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'UPDATE_SELECTION', cartItemId, selectedSize, selectedColor });
      return;
    }
    try {
      await api.updateCartItem(cartItemId, 1, selectedSize, selectedColor);
      dispatch({ type: 'UPDATE_SELECTION', cartItemId, selectedSize, selectedColor });
    } catch (error) {
      console.error("Failed to update selection:", error);
    }
  };

  const syncClearCart = async () => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }
    try {
      await api.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const enhancedDispatch = (action: CartAction) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        syncAddToCart(action.product, action.selectedSize, action.selectedColor);
        break;
      case 'REMOVE_FROM_CART':
        syncRemoveFromCart(action.cartItemId);
        break;
      case 'UPDATE_QUANTITY':
        syncUpdateQuantity(action.cartItemId, action.quantity);
        break;
      case 'UPDATE_SELECTION':
        syncUpdateSelection(action.cartItemId, action.selectedSize, action.selectedColor);
        break;
      case 'CLEAR_CART':
        syncClearCart();
        break;
      default:
        dispatch(action);
    }
  };

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch: enhancedDispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
