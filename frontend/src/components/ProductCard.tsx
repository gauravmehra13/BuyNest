import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { theme, animations } from '../styles/theme';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TO_CART',
      product,
      selectedSize: product.sizes[0] || '',
      selectedColor: product.colors[0] || ''
    });
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link to={`/products/${product._id}`} className="group block h-[26rem]">
      <div className={`${theme.card.base} ${theme.card.hover} h-full flex flex-col`}>
        <div className="relative h-48 flex-shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 ${animations.slideIn}`}
          />

          <div className="absolute top-2 left-2 space-y-1">
            {product.inventoryCount > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                In Stock
              </span>
            )}
          </div>

          <button className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 ${animations.scaleIn}`}>
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name - Fixed Height */}
          <div className="h-12 mb-2">
            <h3 className={`${theme.text.heading} line-clamp-2 text-sm`}>
              {product.name}
            </h3>
          </div>

          <div className="h-6 flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className={`text-sm ${theme.text.body}`}>(4.0)</span>
          </div>

          <div className="h-10 flex items-center">
            <span className={`text-lg font-bold ${theme.text.heading}`}>{formattedPrice}</span>
          </div>

          <div className="flex-grow"></div>

          <button
            onClick={addToCart}
            className={`${theme.button.primary}`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}