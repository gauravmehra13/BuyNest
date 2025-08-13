import axios from 'axios';
import { AuthResponse, ErrorResponse, User, PastOrder, PastOrderDetail , CheckoutPayload} from '../types';
// import { Product } from '../types';
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
  }) => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'An error occurred' };
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'An error occurred' };
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'An error occurred' };
    }
  },
};

export const profileAPI = {
  updateProfile: async (data: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profilePicture?: string;
  }) => {
    try {
      const response = await axiosInstance.put<{ success: true; user: User }>('/profile', data);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'Failed to update profile' };
    }
  },

  addAddress: async (data: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }) => {
    try {
      const response = await axiosInstance.post<{
        success: true;
        addresses: User['addresses'];
      }>('/profile/address', data);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'Failed to add address' };
    }
  },

  deleteAddress: async (addressId: string) => {
    try {
      const response = await axiosInstance.delete<{
        success: true;
        addresses: User['addresses'];
      }>(`/profile/address/${addressId}`);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'Failed to delete address' };
    }
  },

  getOrders: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get<{
        success: true;
        orders: PastOrder[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>(`/profile/orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'Failed to fetch orders' };
    }
  },

  getOrderDetail: async (orderId: string) => {
    try {
      const response = await axiosInstance.get<{
        success: true;
        order: PastOrderDetail;
      }>(`/profile/orders/${orderId}`);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response?.data) {
        throw err.response.data as ErrorResponse;
      }
      throw { success: false, message: 'Failed to fetch order details' };
    }
  }
};

export const api = {
  // Products
  getAllProducts: async () => {
    const response = await axiosInstance.get('/products');
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  getRelatedProducts: async (category: string) => {
    const response = await axiosInstance.get(`/products?category=${encodeURIComponent(category)}`);
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await axiosInstance.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Checkout
  checkout: async (payload: CheckoutPayload) => {
    const response = await axiosInstance.post('/checkout', payload);
    return response.data;
  },

  // Orders
  getOrder: async (orderNumber: string) => {
    const response = await axiosInstance.get(`/orders/${orderNumber}`);
    return response.data;
  },

  // Cart APIs
  getCart: async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    const response = await axiosInstance.post('/cart/add', { productId, quantity, selectedSize, selectedColor });
    return response.data; 
  },

  removeFromCart: async (cartItemId: string) => {
    const response = await axiosInstance.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },

  updateCartItem: async (cartItemId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    const response = await axiosInstance.put(`/cart/update/${cartItemId}`, { quantity, selectedSize, selectedColor });
    return response.data;
  },

  clearCart: async () => {
      const response = await axiosInstance.post('/cart/clear');
      return response.data;
    },

  // Favorite APIs
  getFavorites: async () => {
    const response = await axiosInstance.get('/favorites'); 
    return response.data; 
  },
  
  addToFavorites: async (productId: string) => {
    const response = await axiosInstance.post('/favorites/add', { productId });
    return response.data; 
  },
  
  removeFromFavorites: async (favoriteId: string) => {
    const response = await axiosInstance.delete(`/favorites/remove/${favoriteId}`);
    return response.data;
  },
  
};
