const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  // Products
  getAllProducts: async () => {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },

  getProduct: async (id: string) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  },

  getRelatedProducts: async (category: string) => {
    const response = await fetch(
      `${BASE_URL}/products?category=${encodeURIComponent(category)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch related products");
    }
    return response.json();
  },

  searchProducts: async (query: string) => {
    const response = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search products");
    }
    return response.json();
  },

  // Checkout
  checkout: async (payload: any) => {
    const response = await fetch(`${BASE_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Checkout failed");
    }
    return response.json();
  },

  // Orders
  getOrder: async (orderNumber: string) => {
    const response = await fetch(`${BASE_URL}/orders/${orderNumber}`);
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return response.json();
  },
};
