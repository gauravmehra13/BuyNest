import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Order } from '../types';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import { ordersAPI } from '../services/api';
export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;

      try {
        const order = await ordersAPI.getOrder(orderNumber) as Order;
        setOrderData(order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">#{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(orderData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">{orderData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-lg">₹{orderData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {orderData.customerName}
                </p>
                <p>{orderData.address}</p>
                <p>{orderData.cityStateZip}</p>
                <p className="mt-2">{orderData.email}</p>
                <p>{orderData.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderData.products.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-600">
                  {new Date(orderData.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">We're preparing your order</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-500">Shipped</p>
                <p className="text-sm text-gray-400">Estimated in 3-4 business days</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-500">Delivered</p>
                <p className="text-sm text-gray-400">
                  Estimated delivery: {estimatedDelivery.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}