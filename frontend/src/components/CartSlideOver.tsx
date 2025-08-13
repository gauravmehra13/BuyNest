import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function CartSlideOver() {
  const { state: cartState, dispatch: cartDispatch, totalPrice } = useCart();

  if (!cartState.isOpen) return null;

  const updateQuantity = (cartItemId: string, quantity: number) => {
    cartDispatch({ type: 'UPDATE_QUANTITY', cartItemId, quantity });
  };

  const removeItem = (cartItemId: string) => {
    cartDispatch({ type: 'REMOVE_FROM_CART', cartItemId });
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
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => cartDispatch({ type: 'CLOSE_CART' })} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={() => cartDispatch({ type: 'CLOSE_CART' })}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartState.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <Link
                  to="/products"
                  onClick={() => cartDispatch({ type: 'CLOSE_CART' })}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-500 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartState.items && cartState.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product?.images?.[0] || '/fallback.png'}
                      alt={item.product?.name || 'Product image'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                      <p className="text-sm text-gray-600">
                        {item.product?.price ? formatPrice(item.product.price) : 'Price not available'}
                      </p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.product?.price ? item.product.price * item.quantity : 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartState.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">Total:</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => cartDispatch({ type: 'CLOSE_CART' })}
                className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}