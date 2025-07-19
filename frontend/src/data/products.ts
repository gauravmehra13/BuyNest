import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'electronics',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    features: ['Noise Cancellation', '30-hour Battery', 'Bluetooth 5.0', 'Quick Charge'],
    rating: 4.5,
    reviews: 256,
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'electronics',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Waterproof', '7-day Battery'],
    rating: 4.8,
    reviews: 412,
    inStock: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'clothing',
    description: 'Comfortable organic cotton t-shirt in various colors.',
    features: ['100% Organic Cotton', 'Pre-shrunk', 'Multiple Colors', 'Soft Feel'],
    rating: 4.3,
    reviews: 89,
    inStock: true
  },
  {
    id: '4',
    name: 'Premium Coffee Beans',
    price: 24.99,
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'food',
    description: 'Freshly roasted premium coffee beans from sustainable farms.',
    features: ['Single Origin', 'Fair Trade', 'Medium Roast', 'Whole Bean'],
    rating: 4.7,
    reviews: 334,
    inStock: true,
    isFeatured: true
  },
  {
    id: '5',
    name: 'Leather Messenger Bag',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'accessories',
    description: 'Handcrafted leather messenger bag perfect for work or travel.',
    features: ['Genuine Leather', 'Laptop Compartment', 'Adjustable Strap', 'Handcrafted'],
    rating: 4.6,
    reviews: 167,
    inStock: true,
    isNew: true
  },
  {
    id: '6',
    name: 'Wireless Charging Pad',
    price: 39.99,
    image: 'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'electronics',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    features: ['Qi Compatible', 'Fast Charging', 'LED Indicator', 'Non-slip Base'],
    rating: 4.4,
    reviews: 203,
    inStock: true
  },
  {
    id: '7',
    name: 'Yoga Mat Premium',
    price: 49.99,
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'fitness',
    description: 'Non-slip premium yoga mat with excellent grip and cushioning.',
    features: ['Non-slip Surface', 'Eco-friendly', 'Extra Thick', 'Carrying Strap'],
    rating: 4.5,
    reviews: 445,
    inStock: true
  },
  {
    id: '8',
    name: 'Ceramic Kitchen Knife Set',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'kitchen',
    description: 'Professional ceramic knife set with ultra-sharp blades.',
    features: ['Ultra Sharp', 'Stain Resistant', 'Ergonomic Handle', '5-piece Set'],
    rating: 4.7,
    reviews: 298,
    inStock: true,
    isFeatured: true
  }
];

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', productCount: 3 },
  { id: 'clothing', name: 'Clothing', icon: 'Shirt', productCount: 1 },
  { id: 'food', name: 'Food & Beverages', icon: 'Coffee', productCount: 1 },
  { id: 'accessories', name: 'Accessories', icon: 'Briefcase', productCount: 1 },
  { id: 'fitness', name: 'Fitness', icon: 'Dumbbell', productCount: 1 },
  { id: 'kitchen', name: 'Kitchen', icon: 'ChefHat', productCount: 1 }
];