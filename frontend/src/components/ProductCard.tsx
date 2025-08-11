import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';

import { Link } from 'react-router-dom';
import { theme, animations } from '../styles/theme';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch: cartDispatch } = useCart();
  const { state: favState, dispatch: favDispatch } = useFavorites();

  const isFavorite = favState.items.some(f => f.product._id === product._id);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cartDispatch({
      type: 'ADD_TO_CART',
      product,
      selectedSize: product.sizes[0] || '',
      selectedColor: product.colors[0] || '',
    });
  };

  const addToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite) return;  // prevent duplicate add
    favDispatch({ type: 'ADD_TO_FAVORITES', product });
  };
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block"
    >
      <div className={`${theme.card.base} ${theme.card.hover} flex flex-col h-full`}>
        <div className="relative h-40 sm:h-48">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-contain group-hover:scale-105 ${animations.slideIn}`}
          />

          <div className="absolute top-2 left-2 space-y-1">
            {product.inventoryCount > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                In Stock
              </span>
            )}
          </div>

          <button
            className={`absolute top-2 right-2 p-2 rounded-full shadow-md ${animations.scaleIn} ${isFavorite
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            onClick={addToFavorites}
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div className="p-3 sm:p-4 flex flex-col gap-2">
          <h3 className={`${theme.text.heading} text-sm line-clamp-2 min-h-[2.5em]`}>
            {product.name}
          </h3>

          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className={`text-xs sm:text-sm ${theme.text.body}`}>(4.0)</span>
          </div>

          <div className="flex items-center">
            <span className={`text-base sm:text-lg font-bold ${theme.text.heading}`}>{formattedPrice}</span>
          </div>

          <button
            onClick={addToCart}
            className={`${theme.button.primary} w-full text-sm sm:text-base py-1.5 sm:py-2 mt-1`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}