import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { api } from '../services/api';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product; selectedSize?: string; selectedColor?: string }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'UPDATE_SELECTION'; productId: string; selectedSize?: string; selectedColor?: string }
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
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.product._id && 
        item.selectedSize === action.selectedSize && 
        item.selectedColor === action.selectedColor
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.product._id && 
            item.selectedSize === action.selectedSize && 
            item.selectedColor === action.selectedColor
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { 
          id: action.product._id, 
          product: action.product, 
          quantity: 1,
          selectedSize: action.selectedSize,
          selectedColor: action.selectedColor
        }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.productId)
      };

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.productId)
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        )
      };

    case 'UPDATE_SELECTION':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.productId
            ? { ...item, selectedSize: action.selectedSize, selectedColor: action.selectedColor }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Fetch cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartItems = await api.getCart();
        dispatch({ type: 'SET_CART', items: cartItems });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  // Sync actions with backend
  const syncAddToCart = async (product: Product, selectedSize?: string, selectedColor?: string) => {
    try {
      await api.addToCart(product._id, 1, selectedSize, selectedColor);
      dispatch({ type: 'ADD_TO_CART', product, selectedSize, selectedColor });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const syncRemoveFromCart = async (productId: string) => {
    try {
      await api.removeFromCart(productId);
      dispatch({ type: 'REMOVE_FROM_CART', productId });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const syncUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await api.updateCartItem(productId, quantity);
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const syncUpdateSelection = async (productId: string, selectedSize?: string, selectedColor?: string) => {
    try {
      await api.updateCartItem(productId, 1, selectedSize, selectedColor); // Assuming quantity is 1 for selection update
      dispatch({ type: 'UPDATE_SELECTION', productId, selectedSize, selectedColor });
    } catch (error) {
      console.error("Failed to update selection:", error);
    }
  };

  const syncClearCart = async () => {
    try {
      await api.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch: (action) => {
          // Override dispatch to sync with backend
          switch (action.type) {
            case 'ADD_TO_CART':
              syncAddToCart(action.product, action.selectedSize, action.selectedColor);
              break;
            case 'REMOVE_FROM_CART':
              syncRemoveFromCart(action.productId);
              break;
            case 'UPDATE_QUANTITY':
              syncUpdateQuantity(action.productId, action.quantity);
              break;
            case 'UPDATE_SELECTION':
              syncUpdateSelection(action.productId, action.selectedSize, action.selectedColor);
              break;
            case 'CLEAR_CART':
              syncClearCart();
              break;
            case 'TOGGLE_CART':
              dispatch({ type: 'TOGGLE_CART' });
              break;
            case 'CLOSE_CART':
              dispatch({ type: 'CLOSE_CART' });
              break;
            default:
              dispatch(action);
          }
        },
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}