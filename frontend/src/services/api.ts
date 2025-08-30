import axiosInstance from "./axiosInstance";
import { AuthResponse, User, Order, CheckoutPayload , Product} from "../types";
// import { Product } from '../types';

export const authAPI = {
  register: async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", data);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("token");
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get<AuthResponse>("/auth/me");
    return response.data;
  },
};

export const profileAPI = {
  updateProfile: async (data: { firstName: string; lastName: string; phoneNumber?: string; profilePicture?: string }) => {
    const response = await axiosInstance.put<{ success: true; user: User }>("/profile", data);
    return response.data;
  },

  addAddress: async (data: { street: string; city: string; state: string; zipCode: string; country: string; isDefault: boolean }) => {
    const response = await axiosInstance.post<{ success: true; addresses: User["addresses"] }>("/profile/address", data);
    return response.data;
  },

  deleteAddress: async (addressId: string) => {
    const response = await axiosInstance.delete<{ success: true; addresses: User["addresses"] }>(`/profile/address/${addressId}`);
    return response.data;
  },

  getOrders: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get<{ success: true; orders: Order[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/profile/orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  getOrderDetail: async (orderId: string) => {
    const response = await axiosInstance.get<{ success: true; order: Order }>(`/profile/orders/${orderId}`);
    return response.data;
  },
};

export const productsAPI = {
  getAllProducts: async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  getRelatedProducts: async (category: string): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>(`/products?category=${encodeURIComponent(category)}`);
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await axiosInstance.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export const cartAPI = {
  getCart: async () => {
    const response = await axiosInstance.get("/cart");
    return response.data;
  },

  addToCart: async (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    const response = await axiosInstance.post("/cart/add", { productId, quantity, selectedSize, selectedColor });
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
    const response = await axiosInstance.post("/cart/clear");
    return response.data;
  },
};

export const favoritesAPI = {
  getFavorites: async () => {
    const response = await axiosInstance.get("/favorites");
    return response.data;
  },

  addToFavorites: async (productId: string) => {
    const response = await axiosInstance.post("/favorites/add", { productId });
    return response.data;
  },

  removeFromFavorites: async (favoriteId: string) => {
    const response = await axiosInstance.delete(`/favorites/remove/${favoriteId}`);
    return response.data;
  },
};

export const checkoutAPI = {
  checkout: async (payload: CheckoutPayload) => {
    const response = await axiosInstance.post("/checkout", payload);
    return response.data;
  },
};

export const ordersAPI = {
  getOrder: async (orderNumber: string) => {
    const response = await axiosInstance.get(`/orders/${orderNumber}`);
    return response.data;
  },
};
