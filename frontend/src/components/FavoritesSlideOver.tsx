import { X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function FavoritesSlideOver() {
  const { state: favState, dispatch: favDispatch } = useFavorites();

  if (!favState.isOpen) return null;

  const removeFromFavorites = (favoriteId: string) => {
    favDispatch({ type: 'REMOVE_FROM_FAVORITES', favoriteId });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => favDispatch({ type: 'CLOSE_FAVORITES' })}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Favorites</h2>
            <button
              onClick={() => favDispatch({ type: 'CLOSE_FAVORITES' })}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Favorites List */}
          <div className="flex-1 overflow-y-auto p-4">
            {favState.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Your favorites list is empty</p>
                <Link
                  to="/products"
                  onClick={() => favDispatch({ type: 'CLOSE_FAVORITES' })}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-500 font-medium"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {favState.items.map((favorite) => (
                  <div
                    key={favorite._id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={favorite.product.images[0]}
                      alt={favorite.product.name}
                      loading='lazy'
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/products/${favorite.product._id}`}
                        onClick={() => favDispatch({ type: 'CLOSE_FAVORITES' })}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {favorite.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {formatPrice(favorite.product.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromFavorites(favorite._id)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
