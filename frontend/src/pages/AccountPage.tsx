import { useState, useEffect } from 'react';
import { User, Package, LogOut, Edit, Save, X, Plus, Trash, Mail, Phone, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { theme, commonClasses } from '../styles/theme';
import { profileAPI } from '../services/api';
import { PastOrder, PastOrderDetail } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function AccountPage() {
  const { state, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PastOrderDetail | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    phoneNumber: state.user?.phoneNumber || '',
    profilePicture: state.user?.profilePicture || ''
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Fetch orders when tab changes to orders
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, currentPage]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await profileAPI.getOrders(currentPage);
      setOrders(response.orders);
      setTotalPages(response.pagination.pages);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const { user } = await profileAPI.updateProfile(editedProfile);
      updateUser(user);
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      setIsLoading(true);
      setError('');
      const { addresses } = await profileAPI.addAddress(newAddress);
      updateUser({
        ...state.user!,
        addresses
      });
      setIsAddingAddress(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add address';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      setError('');
      const { addresses } = await profileAPI.deleteAddress(addressId);
      updateUser({
        ...state.user!,
        addresses
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete address';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewOrderDetail = async (orderId: string) => {
    try {
      setIsModalLoading(true);
      setModalError('');
      const { order } = await profileAPI.getOrderDetail(orderId);
      setSelectedOrder(order);
      setIsOrderModalOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order details';
      setModalError(errorMessage);
    } finally {
      setIsModalLoading(false);
    }
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
    { id: 'orders', label: 'Order History', icon: Package }
  ];

  const renderProfileFields = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name
        </label>
        {isEditing ? (
          <input
            type="text"
            value={editedProfile.firstName}
            onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
            className={theme.input.base}
          />
        ) : (
          <p className={`${theme.text.heading} py-2`}>
            {state.user?.firstName || 'Not provided'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name
        </label>
        {isEditing ? (
          <input
            type="text"
            value={editedProfile.lastName}
            onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
            className={theme.input.base}
          />
        ) : (
          <p className={`${theme.text.heading} py-2`}>
            {state.user?.lastName || 'Not provided'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-gray-400" />
          <p className={`${theme.text.heading} py-2`}>
            {state.user?.email}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        {isEditing ? (
          <input
            type="tel"
            value={editedProfile.phoneNumber}
            onChange={(e) => setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })}
            className={theme.input.base}
            placeholder="(123) 456-7890"
          />
        ) : (
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gray-400" />
            <p className={`${theme.text.heading} py-2`}>
              {state.user?.phoneNumber || 'Not provided'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Reset edited profile when user data changes
  useEffect(() => {
    if (state.user) {
      setEditedProfile({
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        phoneNumber: state.user.phoneNumber || '',
        profilePicture: state.user.profilePicture || ''
      });
    }
  }, [state.user]);

  if (!state.isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gray-50 ${commonClasses.flexCenter}`}>
        <div className="text-center">
          <h1 className={`text-2xl ${theme.text.heading} mb-4`}>Please log in to view your account</h1>
          <Link to="/login" className={theme.button.primary}>Log In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={commonClasses.pageContainer}>
      <div className={theme.layout.section}>
        <div className={theme.card.base}>
          {/* Header with Sign Out */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h1 className={`text-2xl ${theme.text.heading}`}>My Account</h1>
                <p className={theme.text.body}>
                  Welcome back, {state.user?.firstName} {state.user?.lastName}!
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
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

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Profile Information Section */}
                <div className="border rounded-lg p-6">
                  <div className={commonClasses.flexBetween + " mb-6"}>
                    <h2 className={`text-xl ${theme.text.heading}`}>Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className={`flex items-center space-x-2 ${theme.button.secondary}`}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className={theme.button.primary}
                        >
                          <Save className="h-4 w-4" />
                          <span>{isLoading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedProfile({
                              firstName: state.user?.firstName || '',
                              lastName: state.user?.lastName || '',
                              phoneNumber: state.user?.phoneNumber || '',
                              profilePicture: state.user?.profilePicture || ''
                            });
                          }}
                          disabled={isLoading}
                          className={theme.button.secondary}
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {renderProfileFields()}
                </div>

                {/* Addresses Section */}
                <div className="border rounded-lg p-6">
                  <div className={commonClasses.flexBetween + " mb-6"}>
                    <h2 className={`text-xl ${theme.text.heading}`}>Addresses</h2>
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className={`flex items-center space-x-2 ${theme.button.primary}`}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  {/* Add Address Form */}
                  {isAddingAddress && (
                    <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Street"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          className={theme.input.base}
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className={theme.input.base}
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className={theme.input.base}
                        />
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          className={theme.input.base}
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          className={theme.input.base}
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newAddress.isDefault}
                            onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                            className="mr-2"
                          />
                          <label>Set as default address</label>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => setIsAddingAddress(false)}
                          className={theme.button.secondary}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAddress}
                          disabled={isLoading}
                          className={theme.button.primary}
                        >
                          {isLoading ? 'Adding...' : 'Add Address'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Address List */}
                  <div className="space-y-4">
                    {state.user?.addresses.map((address) => (
                      <div
                        key={address._id}
                        className="p-4 bg-gray-50 border rounded-lg flex justify-between items-start"
                      >
                        <div>
                          <p className={theme.text.body}>
                            {address.street}
                            <br />
                            {address.city}, {address.state} {address.zipCode}
                            <br />
                            {address.country}
                          </p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                              Default Address
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className={`text-xl ${theme.text.heading} mb-6`}>Order History</h2>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className={commonClasses.flexBetween + " mb-4"}>
                          <div>
                            <h4 className={theme.text.heading}>Order #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <p className="mt-1 font-semibold">${order.totalAmount.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.products.map((product, idx) => (
                            <div key={idx} className={commonClasses.flexBetween + " text-sm"}>
                              <span>
                                {product.name} × {product.quantity}
                                {product.selectedSize && ` - Size: ${product.selectedSize}`}
                                {product.selectedColor && ` - Color: ${product.selectedColor}`}
                              </span>
                              <span>${(product.price * product.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => handleViewOrderDetail(order._id)}
                          className={`mt-4 ${theme.button.secondary}`}
                        >
                          View Details
                        </button>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center space-x-2 mt-6">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    )}
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
                    <button className={theme.button.primary}>Change Password</button>
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

      {/* Order Detail Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {isModalLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : modalError ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {modalError}
                </div>
              ) : selectedOrder ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className={`text-xl ${theme.text.heading}`}>
                        Order #{selectedOrder.orderNumber}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsOrderModalOpen(false);
                        setSelectedOrder(null);
                        setModalError('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Order Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="border-t pt-4">
                    <h3 className={`text-lg ${theme.text.heading} mb-3`}>Customer Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{selectedOrder.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">
                          {selectedOrder.address}<br />
                          {selectedOrder.cityStateZip}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h3 className={`text-lg ${theme.text.heading} mb-3`}>Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.products.map((product, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-gray-500">
                              {product.selectedSize && `Size: ${product.selectedSize}`}
                              {product.selectedSize && product.selectedColor && ' | '}
                              {product.selectedColor && `Color: ${product.selectedColor}`}
                            </p>
                            <p className="text-gray-500">Quantity: {product.quantity}</p>
                          </div>
                          <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className={`text-lg ${theme.text.heading}`}>Total</span>
                    <span className="text-lg font-bold">${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}