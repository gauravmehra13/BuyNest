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
  _id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  phoneNumber?: string;
  addresses: {
    _id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: { msg: string; param: string }[];
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
  user: string; // Required user ID
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  totalAmount: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  cityStateZip: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  transactionType: "1" | "2" | "3";
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

export interface PaginationResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}

export interface OrderProduct {
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface PastOrderProduct {
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface PastOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products: PastOrderProduct[];
  createdAt: string;
}

export interface PastOrderDetail extends PastOrder {
  user: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  cityStateZip: string;
  transactionStatus: 'Approved' | 'Declined' | 'Gateway Error';
  updatedAt: string;
}