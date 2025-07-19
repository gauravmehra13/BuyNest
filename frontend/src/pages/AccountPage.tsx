import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Package, Settings, LogOut, Edit, Save, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { theme, commonClasses } from '../styles/theme';

interface ProfileData {
  [key: string]: string; 
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function AccountPage() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Mock order history
  const orderHistory = [
    {
      id: '12345',
      date: '2025-01-15',
      status: 'delivered',
      total: 159.98,
      items: [
        { name: 'Wireless Bluetooth Headphones', quantity: 1, price: 79.99 },
        { name: 'Smart Fitness Watch', quantity: 1, price: 79.99 }
      ]
    },
    {
      id: '12344',
      date: '2025-01-10',
      status: 'shipped',
      total: 89.99,
      items: [
        { name: 'Leather Messenger Bag', quantity: 1, price: 89.99 }
      ]
    },
    {
      id: '12343',
      date: '2025-01-05',
      status: 'processing',
      total: 49.99,
      items: [
        { name: 'Yoga Mat Premium', quantity: 1, price: 49.99 }
      ]
    }
  ];

  if (!state.isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gray-50 ${commonClasses.flexCenter}`}>
        <div className="text-center">
          <h1 className={`text-2xl ${theme.text.heading} mb-4`}>Please log in to view your account</h1>
          <Link
            to="/login"
            className={theme.button.primary}
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={commonClasses.pageContainer}>
      <div className={theme.layout.section}>
        <div className={theme.card.base}>
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h1 className={`text-2xl ${theme.text.heading}`}>My Account</h1>
              <p className={theme.text.body}>Welcome back, {state.user?.name}!</p>
            </div>

            {/* Tabs */}
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <div className={commonClasses.flexBetween + " mb-6"}>
                  <h2 className={`text-xl ${theme.text.heading}`}>Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`flex items-center space-x-2 ${theme.text.link}`}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className={theme.button.primary}
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className={theme.button.secondary}
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Profile form fields */}
                  {['name', 'email', 'phone', 'address', 'city', 'state'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      {isEditing ? (
                        <input
                          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                          value={profileData[field]}
                          onChange={(e) => setProfileData({ ...profileData, [field]: e.target.value })}
                          className={theme.input.base}
                          placeholder={field === 'phone' ? '(123) 456-7890' : ''}
                        />
                      ) : (
                        <p className={`${theme.text.heading} py-2`}>
                          {profileData[field] || 'Not provided'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className={`text-xl ${theme.text.heading} mb-6`}>Order History</h2>

                {orderHistory.length === 0 ? (
                  <div className={`text-center py-12 ${commonClasses.flexCenter} flex-col`}>
                    <Package className="h-12 w-12 text-gray-400 mb-4" />
                    <p className={`${theme.text.body} text-lg`}>No orders yet</p>
                    <Link
                      to="/products"
                      className={`inline-block mt-4 ${theme.button.primary}`}
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orderHistory.map((order) => (
                      <div key={order.id} className={theme.card.base + " border border-gray-200 p-6"}>
                        <div className={commonClasses.flexBetween + " mb-4"}>
                          <div>
                            <h3 className={theme.text.heading}>Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <p className={`text-lg font-bold ${theme.text.heading} mt-1`}>
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className={commonClasses.flexBetween + " text-sm"}>
                              <span className={theme.text.heading}>
                                {item.name} × {item.quantity}
                              </span>
                              <span className={theme.text.body}>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className={commonClasses.flexBetween + " mt-4 pt-4 border-t"}>
                          <button className={theme.text.link + " text-sm font-medium"}>
                            View Details
                          </button>
                          {order.status === 'delivered' && (
                            <button className={theme.text.link + " text-sm font-medium"}>
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <h2 className={`text-xl ${theme.text.heading} mb-6`}>Account Settings</h2>

                <div className="space-y-6">
                  <div className={theme.card.base + " border border-gray-200 p-6"}>
                    <h3 className={theme.text.heading + " mb-2"}>Password</h3>
                    <p className={theme.text.body + " mb-4"}>Update your password to keep your account secure.</p>
                    <button className={theme.button.primary}>
                      Change Password
                    </button>
                  </div>

                  <div className={theme.card.base + " border border-gray-200 p-6"}>
                    <h3 className={theme.text.heading + " mb-2"}>Email Notifications</h3>
                    <p className={theme.text.body + " mb-4"}>Manage your email notification preferences.</p>
                    <div className="space-y-3">
                      {['Order updates', 'Promotional emails', 'Product recommendations'].map((label, index) => (
                        <label key={label} className="flex items-center">
                          <input type="checkbox" defaultChecked={index < 2} className="mr-3" />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={theme.card.base + " border border-red-200 p-6"}>
                    <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-red-600 mb-4">Permanently delete your account and all associated data.</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}