import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShippingFast, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

// Add backend API URL - Fixed to properly use environment variables or fallback
const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

const Auth = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '', 
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  // Load saved data from localStorage if available
  useEffect(() => {
    const savedCheckout = localStorage.getItem('pendingCheckout');
    if (savedCheckout) {
      try {
        const { formData: savedFormData } = JSON.parse(savedCheckout);
        if (savedFormData) {
          setFormData(savedFormData);
          // Set form as touched if we loaded saved data that has an email
          if (savedFormData.email) {
            setFormTouched(true);
          }
        }
      } catch (error) {
        console.error('Error parsing saved checkout data', error);
      }
    }
  }, []);

  // Track when user leaves the page without completing the order
  useEffect(() => {
    return () => {
      // Only send abandoned cart email if:
      // 1. The form has been touched (user entered data)
      // 2. We have the user's email
      // 3. No order success flag is set in sessionStorage
      const orderSuccessFlag = sessionStorage.getItem('orderSuccessful');
      
      if (formTouched && formData.email && !orderSuccessFlag) {
        sendAbandonedCartEmail();
      }
    };
  }, [formData, formTouched]);

  // Function to send abandoned cart email
  const sendAbandonedCartEmail = async () => {
    try {
      if (!formData.email) return;
      
      // Format cart items into a proper products array structure for the email API
      const products = cart.map(item => ({
        name: item.title,
        quantity: item.quantity,
        price: (typeof item.price === 'number') ? item.price.toFixed(2) : item.price,
        image: item.image
      }));

      // Calculate cart total
      const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      const orderDetails = {
        orderNumber: `PENDING-${Date.now()}`,
        products,
        totalAmount: cartTotal,
        currency: '₹'
      };
      
      const customerDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.pincode
      };
      
      // Use direct fetch without AbortController
      const response = await fetch(`${API_URL}/send-abandoned-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: formData.email,
          orderDetails,
          customerDetails
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      console.log("Abandoned cart email sent for shipping page");
    } catch (error) {
      console.warn('Error sending abandoned cart email from shipping page:', error.message || error);
      // Silent fail for abandoned cart emails - non-critical functionality
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark form as touched when user enters data
    if (!formTouched) {
      setFormTouched(true);
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save form data to localStorage
      const pendingCheckout = localStorage.getItem('pendingCheckout');
      let checkoutData = pendingCheckout ? JSON.parse(pendingCheckout) : {};
      
      localStorage.setItem('pendingCheckout', JSON.stringify({
        ...checkoutData,
        formData,
        timestamp: new Date().toISOString()
      }));
      
      // Navigate to checkout page with form data
      navigate('/checkout', { state: { formData } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header & Progress */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-center">Shipping Information</h1>
            <div></div> {/* Empty div for flex alignment */}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  type="submit"
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
          
          {/* Trust Badge */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <FaShippingFast className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-xs text-gray-500">On orders over ₹3,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;