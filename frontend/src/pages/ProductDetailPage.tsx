import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { theme, commonClasses } from '../styles/theme';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await api.getProduct(id);
        setProduct(productData);
        setSelectedSize(productData.sizes[0] || '');
        setSelectedColor(productData.colors[0] || '');

        // Fetch related products
        const related = await api.getRelatedProducts(productData.category);
        setRelatedProducts(related.filter((p: Product) => p._id !== id).slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen ${commonClasses.flexCenter} ${commonClasses.pageContainer}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${commonClasses.flexCenter} ${commonClasses.pageContainer}`}>
        <div className="text-center">
          <h1 className={`text-2xl ${theme.text.heading} mb-4`}>Product Not Found</h1>
          <Link to="/products" className={theme.text.link}>
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_TO_CART',
        product,
        selectedSize,
        selectedColor
      });
    }
  };

  return (
    <div className={commonClasses.pageContainer}>
      <div className={theme.layout.section}>
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link to="/" className={theme.text.link}>Home</Link>
          <span className={theme.text.body}>/</span>
          <Link to="/products" className={theme.text.link}>Products</Link>
          <span className={theme.text.body}>/</span>
          <span className={theme.text.heading}>{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className={`aspect-square ${theme.card.base}`}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className={`text-3xl ${theme.text.heading} mb-2`}>{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className={`text-sm ${theme.text.body}`}>
                4.0 (128 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-6">
              <span className={`text-3xl ${theme.text.heading}`}>${product.price}</span>
              <span className={`text-sm ${theme.text.body}`}>
                {product.inventoryCount} in stock
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className={`${theme.text.heading} mb-2`}>Description</h3>
              <p className={theme.text.body}>{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className={`${theme.text.heading} mb-2`}>Size</h3>
                <div className="flex space-x-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className={`${theme.text.heading} mb-2`}>Color</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedColor === color
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <h3 className={`${theme.text.heading} mb-2`}>Category</h3>
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <label className={`text-sm font-medium ${theme.text.heading}`}>Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`px-3 py-1 ${theme.text.body} hover:text-gray-800`}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`px-3 py-1 ${theme.text.body} hover:text-gray-800`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  className={`flex-1 ${theme.button.primary}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>

                <button className={theme.button.secondary}>
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span className={`text-sm ${theme.text.body}`}>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary-600" />
                <span className={`text-sm ${theme.text.body}`}>2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-2xl ${theme.text.heading} mb-8`}>Related Products</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

}