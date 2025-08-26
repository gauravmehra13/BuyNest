import { useState, useMemo, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { theme, commonClasses } from '../styles/theme';
import { getCachedData, setCachedData } from '../utils/cache';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('search') || '';



  // Fetch products (uses cache, and after cache expiry, fetches new products from API)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const cacheKey = searchQuery ? `searchProducts_${searchQuery}` : 'allProducts';
        const cachedProducts = getCachedData(cacheKey) as Product[] | null;

        if (cachedProducts) {
          setProducts(cachedProducts);
          setLoading(false);
          return;
        }

        let fetchedProducts: Product[];
        if (searchQuery) {
          fetchedProducts = await api.searchProducts(searchQuery) as Product[];
        } else {
          fetchedProducts = await api.getAllProducts() as Product[];
        }

        setProducts(fetchedProducts);
        setCachedData(cacheKey, fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.map(cat => ({
      id: cat.toLowerCase(),
      name: cat,
      icon: 'Package',
      productCount: products.filter(p => p.category === cat).length
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category.toLowerCase() === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        // Since we don't have rating in API, sort by inventory count
        filtered.sort((a, b) => b.inventoryCount - a.inventoryCount);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy, priceRange]);

  return (
    <div className={commonClasses.pageContainer}>
      <div className={theme.layout.section}>
        {/* Header */}
        <div className={commonClasses.flexBetween + " mb-8"}>
          <div>
            <h1 className={`text-3xl ${theme.text.heading}`}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Products'}
            </h1>
            <p className={theme.text.body + " mt-2"}>
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="hidden md:flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? theme.gradients.primary + ' text-white' : theme.text.body}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? theme.gradients.primary + ' text-white' : theme.text.body}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={theme.input.base}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`${theme.button.secondary} md:hidden`}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-64 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className={theme.card.base + " p-6 space-y-6"}>
              {/* Categories */}
              <div>
                <h3 className={theme.text.heading + " mb-3"}>Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category.name} ({category.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className={theme.text.heading + " mb-3"}>Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className={commonClasses.flexBetween + " text-sm " + theme.text.body}>
                    <span>₹0</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={commonClasses.cardGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={theme.card.base + " animate-pulse"}>
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={`text-center py-12 ${commonClasses.flexCenter} flex-col`}>
                <p className={`text-lg ${theme.text.body}`}>No products found</p>
                <p className={`mt-2 ${theme.text.body}`}>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? commonClasses.cardGrid : 'space-y-4'}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}