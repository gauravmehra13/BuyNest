import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../utils/stripe';
import { theme, commonClasses } from '../styles/theme';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { checkoutAPI } from '../services/api';
import { CheckoutResponse } from '../types';

const StripeCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { state: cartState, dispatch, totalPrice } = useCart();
  const { state: authState } = useAuth();
  const [formData, setFormData] = useState({
    firstName: authState.user?.firstName || '',
    lastName: authState.user?.lastName || '',
    email: authState.user?.email || '',
    phone: authState.user?.phoneNumber || '',
    address: authState.user?.addresses.find(addr => addr.isDefault)?.street || '',
    city: authState.user?.addresses.find(addr => addr.isDefault)?.city || '',
    state: authState.user?.addresses.find(addr => addr.isDefault)?.state || '',
    zipCode: authState.user?.addresses.find(addr => addr.isDefault)?.zipCode || '',
    country: 'IN',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [authState.isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const phoneRegex = /^\+?[1-9]\d{7,14}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number with country code';
      }
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP/Postal code is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const shipping = 0; // Free shipping
  const tax = totalPrice * 0.08; // 8% tax
  const total = totalPrice + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStripeError(null);

    // Check if cart is empty
    if (cartState.items.length === 0) {
      setStripeError('Your cart is empty. Add items to proceed.');
      return;
    }

    if (!validateForm()) return;
    if (!stripe || !elements) return;

    // Ensure user ID is defined
    if (!authState.user?._id) {
      setStripeError('User ID is missing. Please log in again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create Stripe payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setStripeError('Card details are incomplete.');
        setIsProcessing(false);
        return;
      }
      const { error: stripeErr, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zipCode,
            country: formData.country,
          }
        }
      });
      if (stripeErr) {
        setStripeError(stripeErr.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      const checkoutPayload = {
        user: authState.user._id,
        products: cartState.items.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        totalAmount: total,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phone.replace(/\s+/g, ''),
        address: formData.address,
        cityStateZip: `${formData.city}, ${formData.state} ${formData.zipCode}`,
        paymentMethodId: paymentMethod.id,
      };

      // Add type assertion for the response
      const response = await checkoutAPI.checkout(checkoutPayload) as CheckoutResponse;

      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order-confirmation/${response.orderNumber}`);
    } catch (error: any) {
      setStripeError(
        error?.response?.data?.message ||
        error?.message ||
        'Checkout failed. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const inputClasses = (fieldName: string) => `${theme.input.base} ${errors[fieldName] ? 'border-red-500' : ''}`;

  return (
    <div className={commonClasses.pageContainer}>
      <div className={theme.layout.section}>
        <h1 className={`text-3xl ${theme.text.heading} mb-8`}>Checkout</h1>
        {stripeError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {stripeError}
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className={theme.card.base + " p-6"}>
                <div className={commonClasses.flexVerticalCenter + " space-x-2 mb-6"}>
                  <Truck className="h-5 w-5 text-primary-600" />
                  <h2 className={`text-xl ${theme.text.heading}`}>Shipping Information</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'firstName', label: 'First Name', type: 'text' },
                    { name: 'lastName', label: 'Last Name', type: 'text' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'phone', label: 'Phone (with country code)', type: 'tel', placeholder: '+91XXXXXXXXXX' },
                    { name: 'address', label: 'Address', type: 'text', span: true },
                    { name: 'city', label: 'City', type: 'text' },
                    { name: 'state', label: 'State', type: 'text' },
                    { name: 'zipCode', label: 'PIN Code', type: 'text', placeholder: '123456' }
                  ].map((field) => (
                    <div key={field.name} className={field.span ? 'md:col-span-2' : ''}>
                      <label className={`block text-sm font-medium ${theme.text.heading} mb-2`}>
                        {field.label} *
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className={inputClasses(field.name)}
                      />
                      {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Payment Information */}
              <div className={theme.card.base + " p-6"}>
                <div className={commonClasses.flexVerticalCenter + " space-x-2 mb-6"}>
                  <CreditCard className="h-5 w-5 text-primary-600" />
                  <h2 className={`text-xl ${theme.text.heading}`}>Payment Information</h2>
                </div>
                <div className="mb-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#9e2146' },
                      },
                    }}
                  />
                  {/* Info box for test card details */}
                  <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-start text-blue-800 text-sm">
                    <svg className="h-5 w-5 mr-2 mt-0.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <span>
                      <strong>Test Payment Info:</strong><br />
                      Use card number <span className="font-mono">4242 4242 4242 4242</span>.<br />
                      <strong>Expiry:</strong> Any future date (e.g., <span className="font-mono">12/34</span>)<br />
                      <strong>CVC:</strong> Any 3 digits (e.g., <span className="font-mono">123</span>)<br />
                      <strong>ZIP/Postal Code:</strong> Any <span className="font-mono">5</span> digits (e.g., <span className="font-mono">12345</span>).<br />
                      <span className="text-xs text-blue-700">Note: For testing, Stripe expects a 5-digit ZIP code, not a 6-digit Indian PIN.</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full ${theme.button.primary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
          {/* Order Summary */}
          <div className={theme.card.base + " p-6 h-fit"}>
            <h2 className={`text-xl ${theme.text.heading} mb-4`}>Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartState.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    loading='lazy'
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium ${theme.text.heading} text-sm`}>{item.product.name}</h3>
                    <p className={`text-sm ${theme.text.body}`}>Qty: {item.quantity}</p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
                    )}
                  </div>
                  <span className={`font-medium ${theme.text.heading} text-sm`}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className={commonClasses.flexBetween + " text-sm"}>
                <span className={theme.text.body}>Subtotal</span>
                <span className="font-medium">{formatCurrency(totalPrice)}</span>
              </div>
              <div className={commonClasses.flexBetween + " text-sm"}>
                <span className={theme.text.body}>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className={commonClasses.flexBetween + " text-sm"}>
                <span className={theme.text.body}>Tax</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className={commonClasses.flexBetween + " text-lg font-bold pt-2 border-t"}>
                <span className={theme.text.heading}>Total</span>
                <span className={theme.text.heading}>{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-800 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Free shipping on orders over ₹5,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StripeCheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm />
    </Elements>
  );
};

export default StripeCheckoutPage;