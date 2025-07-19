import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { theme } from '../styles/theme';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await api.getAllProducts();
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Discover Amazing
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                  Premium Products
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Find everything you need with our curated selection of premium products at unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className={`${theme.button.primary} text-lg`}
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Featured Product"
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className={theme.layout.container}>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className={theme.text.heading}>Free Shipping</h3>
              <p className={theme.text.body}>Free shipping on orders over ₹500</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className={theme.text.heading}>Secure Payment</h3>
              <p className={theme.text.body}>Your payment information is safe</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className={theme.text.heading}>24/7 Support</h3>
              <p className={theme.text.body}>Get help whenever you need it</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className={theme.text.heading}>Easy Returns</h3>
              <p className={theme.text.body}>30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className={theme.layout.container}>
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${theme.text.heading} mb-4`}>Featured Products</h2>
            <p className={`${theme.text.body} max-w-2xl mx-auto`}>
              Discover our handpicked selection of premium products that our customers love most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, i) => (
                <div key={i} className={theme.card.base + " animate-pulse"}>
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className={`${theme.button.primary} inline-flex items-center`}
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className={theme.layout.container}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest updates on new products and exclusive offers.
            </p>
            <form className="max-w-md mx-auto flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className={theme.input.base}
              />
              <button
                type="submit"
                className={theme.button.primary}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}