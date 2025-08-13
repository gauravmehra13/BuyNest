import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CheckoutPayload } from '../types';
import { CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { theme, commonClasses } from '../styles/theme';

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { state: cartState, dispatch, totalPrice } = useCart();
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [authState.isAuthenticated, navigate]);

  // Pre-fill form with user data if available
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

    // Payment fields
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Shipping validation
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
      // Phone validation: Allow +, country code, and 7-15 digits
      // Example valid formats: +919876543210, 919876543210, +1234567890
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

    // Payment validation
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number is invalid';
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be MM/YY format';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < new Date()) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData({ ...formData, [name]: formatted });
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setFormData({ ...formData, [name]: formatted });
    }
    // Format phone number - just remove spaces and keep the raw number with + if present
    else if (name === 'phone') {
      const formatted = value.replace(/[^\d+]/g, '');
      setFormData({ ...formData, [name]: formatted });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!authState.user?._id) {
      setErrors({ submit: 'Please log in to complete your purchase' });
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare checkout payload
      const checkoutPayload: CheckoutPayload = {
        user: authState.user._id, // Required user ID
        products: cartState.items.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })),
        totalAmount: total,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phone.replace(/\s+/g, ''),
        address: formData.address,
        cityStateZip: `${formData.city}, ${formData.state} ${formData.zipCode}`,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate.replace('/', '-'),
        cvv: formData.cvv,
        transactionType: "1" // 1 = Approved, 2 = Declined, 3 = Gateway Error
      };

      console.log('Sending checkout payload:', checkoutPayload); // Add this for debugging

      const response = await api.checkout(checkoutPayload);

      // Clear cart and redirect
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order-confirmation/${response.orderNumber}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      setErrors({ submit: 'Payment processing failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const shipping = 0; // Free shipping
  const tax = totalPrice * 0.08; // 8% tax
  const total = totalPrice + shipping + tax;

  if (cartState.items.length === 0) {
    return (
      <div className={`min-h-screen ${commonClasses.flexCenter} ${commonClasses.pageContainer}`}>
        <div className="text-center">
          <h1 className={`text-2xl ${theme.text.heading} mb-4`}>Your cart is empty</h1>
          <button
            onClick={() => navigate('/products')}
            className={theme.button.primary}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const inputClasses = (fieldName: string) => `${theme.input.base} ${errors[fieldName] ? 'border-red-500' : ''}`;

  return (
    <div className={commonClasses.pageContainer}>
      <div className={theme.layout.section}>
        <h1 className={`text-3xl ${theme.text.heading} mb-8`}>Checkout</h1>

        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errors.submit}
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

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'cardNumber', label: 'Card Number', type: 'text', placeholder: '1234 5678 9012 3456', span: true, maxLength: 19 },
                    { name: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY', maxLength: 5 },
                    { name: 'cvv', label: 'CVV', type: 'text', placeholder: '123', maxLength: 4 },
                    { name: 'cardName', label: 'Name on Card', type: 'text', span: true }
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
                        maxLength={field.maxLength}
                        className={inputClasses(field.name)}
                      />
                      {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full ${theme.button.primary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Complete Order - {formatCurrency(total)}</span>
                  </>
                )}
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
}