import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoriteContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: favState, dispatch: favDispatch } = useFavorites();
  const { state: authState } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (location.pathname === '/products' && !value.trim()) {
      navigate('/products');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/products') {
      navigate('/products');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Made slightly smaller on medium screens */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">BuyNest</span>
          </Link>

          {/* Desktop Navigation - Adjusted spacing and breakpoints */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8 ml-4 lg:ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${location.pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-700'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Adjusted for better responsive behavior */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-10 py-1.5 lg:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Side Icons - Adjusted spacing */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Cart */}
            <button
              onClick={() => cartDispatch({ type: 'TOGGLE_CART' })}
              className="relative p-1.5 lg:p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
              {cartState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 lg:h-5 w-4 lg:w-5 flex items-center justify-center">
                  {cartState.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Favorites */}
            <button
              onClick={() => favDispatch({ type: 'TOGGLE_FAVORITES' })}
              className="relative p-1.5 lg:p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
              {favState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 lg:h-5 w-4 lg:w-5 flex items-center justify-center">
                  {favState.items.length}
                </span>
              )}
            </button>

            {/* User */}
            <Link
              to={authState.isAuthenticated ? '/account' : '/login'}
              className="p-1.5 lg:p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <User className="h-5 w-5 lg:h-6 lg:w-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-2 py-2 text-base font-medium transition-colors hover:text-blue-600 ${location.pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-700'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}