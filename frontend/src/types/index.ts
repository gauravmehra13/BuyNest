export interface Product {
  _id: string;
  name: string;
  images: string[];
  sizes: string[];
  colors: string[];
  price: number;
  description: string;
  category: string;
  inventoryCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CheckoutPayload {
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    selectedSize: string;
    selectedColor: string;
  }[];
  totalAmount: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  cityStateZip: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  transactionType: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    selectedSize: string;
    selectedColor: string;
  }[];
  totalAmount: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  cityStateZip: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}