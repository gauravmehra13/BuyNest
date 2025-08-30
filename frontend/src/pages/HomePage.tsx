import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, RefreshCw, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { theme } from '../styles/theme';
import { getCachedData, setCachedData } from '../utils/cache';
import toast from 'react-hot-toast';
import { productsAPI } from '../services/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cacheKey = 'featuredProducts';
        const cachedProducts = getCachedData(cacheKey) as Product[] | null;

        if (cachedProducts) {
          setFeaturedProducts(cachedProducts);
          setLoading(false);
          return;
        }

        const products = await productsAPI.getAllProducts();
        const featured = (products as Product[]).slice(0, 4);
        setFeaturedProducts(featured);
        setCachedData(cacheKey, featured);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email) {
        toast.error('Please enter your email.');
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        toast.success('Thank you for subscribing!');
        setEmail('');
      }, 2000);
    };

    return (
      <section className="py-16 bg-gray-900 text-white">
        <div className={theme.layout.container}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest updates on new products and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={theme.input.base}
              />
              <button
                type="submit"
                disabled={!email || isLoading}
                className={`${theme.button.primary} ${(isLoading || !email) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0D0D0D] to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#312e81_1%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#1e1b4b_1%,transparent_50%)]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 min-h-[85vh] items-center py-12 lg:py-16">
            <div className="w-full max-w-5xl mx-auto lg:mx-0 text-center lg:text-left lg:col-span-7 col-span-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-800/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                <p className="text-sm text-indigo-300 font-medium">Welcome to BuyNest</p>
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight lg:leading-[1.1]">
                <span className="text-white">Your Premium</span>
                <span className="block mt-2 relative">
                  <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    Shopping Nest
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse opacity-20 -z-10"></span>
                </span>
              </h1>

              <p className="mt-6 lg:mt-8 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover handpicked premium products that blend luxury with functionality. Experience shopping redefined
                with our curated collection of exceptional items.
              </p>

              <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products" className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 transform transition-all duration-300 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:scale-105 bg-size-200 hover:bg-pos-100">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-300 bg-white/5 rounded-xl hover:bg-white/10 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => {
                    const featuredSection = document.getElementById('featured-products');
                    if (featuredSection) {
                      featuredSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  View Latest
                </button>
              </div>

              <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-indigo-400" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-indigo-400" />
                  <span>Premium Quality</span>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 border-t border-gray-800/50 pt-8 max-w-2xl mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    10K+
                  </p>
                  <p className="mt-2 text-sm text-gray-400">Happy Customers</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    1K+
                  </p>
                  <p className="mt-2 text-sm text-gray-400">Premium Products</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    99%
                  </p>
                  <p className="mt-2 text-sm text-gray-400">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            <div className="relative lg:block mt-12 lg:mt-0 lg:col-span-5 col-span-12">
              <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl animate-pulse"></div>
              <div className="relative">
                <img
                  src="/hero-section.webp"
                  loading='lazy'
                  alt="Premium Products Showcase"
                  className="relative w-full max-w-xl mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-700 border border-gray-700/30 hover:border-indigo-500/30"
                />
                {/* Floating product cards */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl p-3 border border-indigo-500/30 animate-bounce">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 animate-pulse">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
              </div>
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
      <section id="featured-products" className="py-16 bg-gray-50">
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
      <NewsletterSection />
    </div>
  );
}