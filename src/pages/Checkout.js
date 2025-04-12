import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaLock, FaShippingFast, FaCreditCard, FaArrowLeft, FaCheckCircle, FaShieldAlt, FaMedal, FaRegCreditCard } from 'react-icons/fa';

// Add backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://razorpaybackend-wgbh.onrender.com';

const Checkout = () => {
  const { cart, cartTotal, formatPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Payment information
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Add new state variables for Razorpay integration
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [paymentId, setPaymentId] = useState('');

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      navigate('/');
    }
  }, [cart, navigate, orderComplete]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track potential abandoned cart when user leaves
  useEffect(() => {
    // Save cart data to localStorage for potential abandoned cart recovery
    if (cart.length > 0) {
      localStorage.setItem('pendingCheckout', JSON.stringify({
        cart,
        formData,
        timestamp: new Date().toISOString()
      }));
    }

    // Clean up function to handle potential abandoned cart
    return () => {
      const pendingCheckout = localStorage.getItem('pendingCheckout');
      
      // If checkout is not complete and user has entered email, send abandoned cart email
      if (!orderComplete && formData.email && pendingCheckout && activeStep >= 1) {
        sendAbandonedCartEmail();
      }
      
      // Clear pending checkout data if order was completed
      if (orderComplete) {
        localStorage.removeItem('pendingCheckout');
      }
    };
  }, [formData.email, cart, orderComplete]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    // Validate based on active step
    if (activeStep === 1) {
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
    } 
    else if (activeStep === 2 && paymentMethod === 'card') {
      if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Use format MM/YY';
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateForm()) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
    window.scrollTo(0, 0);
  };

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    try {
      setPaymentProcessing(true);
      
      const orderData = {
        amount: orderTotal,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }
      };
      
      const response = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRazorpayOrder(data.order);
        setRazorpayKeyId(data.key);
        return data;
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setPaymentProcessing(false);
      return null;
    }
  };

  // Display Razorpay payment form
  const displayRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      setPaymentProcessing(false);
      return;
    }
    
    const options = {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'GlowGlaz',
      description: 'Thank you for your purchase!',
      order_id: orderData.order.id,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address
      },
      theme: {
        color: '#4CAF50'
      }
    };
    
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setPaymentProcessing(false);
  };

  // Handle successful Razorpay payment
  const handlePaymentSuccess = async (response) => {
    try {
      setIsSubmitting(true);
      
      // Verify payment with backend
      const verifyPayment = await fetch(`${API_URL}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });
      
      const paymentVerification = await verifyPayment.json();
      
      if (paymentVerification.success) {
        setPaymentId(response.razorpay_payment_id);
        // Generate a unique order reference/number
        const orderRef = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderReference(orderRef);
        
        // Send order confirmation email
        await sendOrderConfirmationEmail(orderRef, response.razorpay_payment_id);
        
        setIsSubmitting(false);
        setOrderComplete(true);
        clearCart();
        localStorage.removeItem('pendingCheckout');
      } else {
        alert('Payment verification failed. Please contact support.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support.');
      setIsSubmitting(false);
    }
  };

  // Send order confirmation email - with improved error handling
  const sendOrderConfirmationEmail = async (orderNumber, paymentId) => {
    try {
      // Prepare data for order confirmation email
      const productNames = cart.map(item => item.title).join(', ');
      const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
      
      const orderDetails = {
        orderNumber,
        productName: productNames,
        quantity: totalQuantity,
        totalAmount: orderTotal,
        currency: '₹',
        paymentMethod: paymentMethod === 'razorpay' ? 'Razorpay' : (paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'),
        paymentId: paymentId || 'COD'
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
      
      // Log the API URL being used (for debugging)
      console.log(`Attempting to send order confirmation email to API: ${API_URL}`);
      
      // Use Promise.race with a timeout instead of AbortController
      const emailPromise = fetch(`${API_URL}/send-order-confirmation`, {
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
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      // Race the email request against the timeout
      const response = await Promise.race([emailPromise, timeoutPromise]);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Email confirmation response:", data);
      
      return data;
    } catch (error) {
      console.error('Error sending confirmation email:', error.message || error);
      
      // Store the order data locally as a fallback
      try {
        const emailData = {
          customerEmail: formData.email,
          orderDetails: {
            orderNumber,
            productNames: cart.map(item => item.title).join(', '),
            quantity: cart.reduce((total, item) => total + item.quantity, 0),
            totalAmount: orderTotal,
            paymentMethod,
            paymentId
          },
          customerDetails: { ...formData },
          timestamp: new Date().toISOString()
        };
        
        // Save to localStorage as a fallback
        const pendingEmails = JSON.parse(localStorage.getItem('pendingOrderEmails') || '[]');
        pendingEmails.push(emailData);
        localStorage.setItem('pendingOrderEmails', JSON.stringify(pendingEmails));
        
        console.log('Order details saved locally for retry later');
      } catch (storageError) {
        console.error('Failed to save order details locally:', storageError);
      }
      
      // Don't block the order completion flow because of email issues
      return { success: false, error: error.message };
    }
  };

  // Similar improvements for abandoned cart email function
  const sendAbandonedCartEmail = async () => {
    try {
      if (!formData.email) return;
      
      // Prepare data for abandoned cart email
      const productNames = cart.map(item => item.title).join(', ');
      const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
      
      const orderDetails = {
        orderNumber: `PENDING-${Date.now()}`,
        productName: productNames,
        quantity: totalQuantity,
        totalAmount: orderTotal,
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
      
      const data = await response.json();
      console.log("Abandoned cart email response:", data);
      
      return data;
    } catch (error) {
      console.warn('Error sending abandoned cart email:', error.message || error);
      // Silent fail for abandoned cart emails - non-critical functionality
    }
  };

  // Add a utility function to check API connection - with fixed error handling
  const checkApiConnection = async () => {
    try {
      // Try a simple fetch without AbortController first
      const response = await fetch(`${API_URL}/server-metrics`);
      return response.ok;
    } catch (error) {
      console.warn('API connection check failed:', error.message);
      // Return false but don't throw - allows checkout to proceed with fallbacks
      return false;
    }
  };

  // Check API connection when component mounts - with silent failure
  useEffect(() => {
    // Don't await here, let it run in background
    checkApiConnection().then(isConnected => {
      if (!isConnected) {
        console.warn('Warning: Backend API seems to be unreachable. Some features may not work correctly.');
      }
    }).catch(() => {
      // Silent catch to prevent unhandled promise rejections
    });
  }, []);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simple API check without AbortController
      let isApiConnected = false;
      try {
        const response = await fetch(`${API_URL}/server-metrics`);
        isApiConnected = response.ok;
      } catch (error) {
        console.warn('API check in order submission failed:', error.message);
        // Continue with fallback behavior
      }
      
      if (paymentMethod === 'razorpay') {
        if (!isApiConnected) {
          alert('Cannot connect to payment server. Please try another payment method or try again later.');
          setIsSubmitting(false);
          return;
        }
        
        // Create Razorpay order and display payment form
        const orderData = await createRazorpayOrder();
        if (orderData) {
          await displayRazorpayPayment(orderData);
        } else {
          setIsSubmitting(false);
        }
      } 
      else if (paymentMethod === 'card') {
        // Process card payment (simulated)
        setTimeout(async () => {
          // Generate a unique order reference/number
          const orderRef = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
          setOrderReference(orderRef);
          
          // Send order confirmation email
          await sendOrderConfirmationEmail(orderRef, 'CARD-PAYMENT');
          
          setIsSubmitting(false);
          setOrderComplete(true);
          clearCart();
          localStorage.removeItem('pendingCheckout');
        }, 2000);
      }
      else if (paymentMethod === 'cod') {
        // Process cash on delivery
        setTimeout(async () => {
          // Generate a unique order reference/number
          const orderRef = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
          setOrderReference(orderRef);
          
          // Send order confirmation email
          await sendOrderConfirmationEmail(orderRef, 'COD');
          
          setIsSubmitting(false);
          setOrderComplete(true);
          clearCart();
          localStorage.removeItem('pendingCheckout');
        }, 1500);
      }
    }
  };

  // Calculate shipping cost and total
  const shippingCost = cartTotal > 3000 ? 0 : 99;
  const orderTotal = cartTotal + shippingCost;
  
  // Calculate estimated delivery date (5-7 days from now)
  const getDeliveryDateRange = () => {
    const start = new Date();
    start.setDate(start.getDate() + 5);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been received.</p>
            
            <div className="border-t border-b py-4 mb-6">
              {/* Use stored orderReference instead of generating a new one */}
              <p className="text-gray-700">Order Reference: <span className="font-bold">{orderReference}</span></p>
              {paymentId && (
                <p className="text-gray-700 mt-2">Payment ID: <span className="font-medium">{paymentId}</span></p>
              )}
            </div>
            
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">Estimated Delivery</h3>
              <p className="text-green-600 text-lg font-semibold">{getDeliveryDateRange()}</p>
              <p className="text-gray-500 text-sm">We'll send you shipping confirmation when your item(s) are on the way!</p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/')} 
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => navigate('/account')} 
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                View Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Checkout Header & Progress */}
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
            <h1 className="text-xl font-bold text-center">Checkout</h1>
            <div></div> {/* Empty div for flex alignment */}
          </div>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FaShoppingCart />
              </div>
              <span className="text-xs mt-1">Cart</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 2 ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FaShippingFast />
              </div>
              <span className="text-xs mt-1">Shipping</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 3 ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FaCreditCard />
              </div>
              <span className="text-xs mt-1">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Trust Badges - Top */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <FaShieldAlt className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Secure Checkout</h3>
                <p className="text-xs text-gray-500">256-bit SSL Encryption</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <FaMedal className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Satisfaction Guaranteed</h3>
                <p className="text-xs text-gray-500">30-Day Money Back</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <FaShippingFast className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Free Shipping</h3>
                <p className="text-xs text-gray-500">On orders over ₹1,000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {activeStep === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                  <form className="space-y-4">
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
                  </form>
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={nextStep}
                      className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-4">
                      <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="card" 
                          checked={paymentMethod === 'card'} 
                          onChange={() => setPaymentMethod('card')}
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="ml-2 flex items-center">
                          <FaCreditCard className="mr-2 text-gray-500" /> 
                          Credit / Debit Card
                        </span>
                      </label>
                      
                      {/* Add Razorpay payment option */}
                      <label className="flex items-center p-4 border border-green-200 bg-green-50 rounded-md cursor-pointer hover:bg-green-100">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="razorpay" 
                          checked={paymentMethod === 'razorpay'} 
                          onChange={() => setPaymentMethod('razorpay')}
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="ml-2 flex items-center">
                          <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-4 h-4 mr-2" />
                          Pay with Razorpay (UPI, Cards, NetBanking, Wallets)
                          <span className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded-full">Recommended</span>
                        </span>
                      </label>
                      
                      <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="cod" 
                          checked={paymentMethod === 'cod'} 
                          onChange={() => setPaymentMethod('cod')}
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">Cash on Delivery</span>
                      </label>
                    </div>
                    
                    {/* Show card form only if card payment method is selected */}
                    {paymentMethod === 'card' && (
                      <div className="mt-6 border-t pt-6">
                        <form className="space-y-4">
                          <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleChange}
                              className={`w-full border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                              className={`w-full border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                placeholder="MM/YY"
                                className={`w-full border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                              />
                              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                placeholder="123"
                                className={`w-full border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                              />
                              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-4">
                            <FaLock className="mr-2" /> 
                            Your payment information is secured with SSL encryption
                          </div>
                          
                          {/* Payment Trust Indicators */}
                          <div className="mt-6 pt-4 border-t">
                            <div className="flex items-center justify-center mb-4">
                              <FaLock className="text-green-600 mr-2" />
                              <span className="text-sm font-medium text-green-600">Secure Payment Processing</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                              <img src="https://cdn.iconscout.com/icon/free/png-256/visa-3-226460.png" alt="Visa" className="h-6 grayscale hover:grayscale-0 transition-all" />
                              <img src="https://cdn.iconscout.com/icon/free/png-256/mastercard-6-226462.png" alt="Mastercard" className="h-6 grayscale hover:grayscale-0 transition-all" />
                              <img src="https://cdn.iconscout.com/icon/free/png-256/american-express-44503.png" alt="American Express" className="h-6 grayscale hover:grayscale-0 transition-all" />
                              <img src="https://cdn.iconscout.com/icon/free/png-256/rupay-1446048-1224020.png" alt="RuPay" className="h-6 grayscale hover:grayscale-0 transition-all" />
                              <img src="https://cdn.iconscout.com/icon/free/png-256/paytm-226448.png" alt="Paytm" className="h-6 grayscale hover:grayscale-0 transition-all" />
                              <img src="https://cdn.iconscout.com/icon/free/png-256/upi-1804457-1530404.png" alt="UPI" className="h-6 grayscale hover:grayscale-0 transition-all" />
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {/* Show Razorpay information */}
                    {paymentMethod === 'razorpay' && (
                      <div className="mt-6 border-t pt-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                          <p className="text-sm text-blue-800">
                            You will be redirected to Razorpay's secure payment gateway to complete your purchase.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 items-center justify-center">
                          <img src="https://cdn.razorpay.com/static/assets/logo/upi.svg" alt="UPI" className="h-8" />
                          <img src="https://cdn.razorpay.com/static/assets/logo/netbanking.svg" alt="Netbanking" className="h-8" />
                          <img src="https://cdn.razorpay.com/static/assets/logo/card.svg" alt="Card" className="h-8" />
                          <img src="https://cdn.razorpay.com/static/assets/logo/wallet.svg" alt="Wallet" className="h-8" />
                        </div>
                      </div>
                    )}
                    
                    {/* Show COD information */}
                    {paymentMethod === 'cod' && (
                      <div className="mt-6 border-t pt-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                          <p className="text-sm text-yellow-800">
                            Pay with cash upon delivery. Please note that COD may not be available for all pin codes.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button 
                      onClick={prevStep}
                      className="border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back to Shipping
                    </button>
                    <button 
                      onClick={handleSubmitOrder}
                      className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center"
                      disabled={isSubmitting || paymentProcessing}
                    >
                      {isSubmitting || paymentProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {paymentProcessing ? 'Initializing Payment...' : 'Processing...'}
                        </>
                      ) : (
                        paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Trust Badges - Bottom */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-center text-sm font-medium text-gray-700 mb-4">Why Shop With Us</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Authentic Products</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Secure Shopping</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex py-2 border-b">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-1">{item.title}</h3>
                      </div>
                      <div className="flex mt-auto justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
                
                {shippingCost === 0 && (
                  <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md flex items-center">
                    <FaShippingFast className="mr-1" />
                    <span>Free shipping applied!</span>
                  </div>
                )}
              </div>
              
              {/* Trust Seals in Order Summary */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-center mb-2">
                  <FaRegCreditCard className="text-gray-500 mr-2" />
                  <span className="text-xs font-medium text-gray-500">PAYMENT METHODS</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <img src="https://cdn.iconscout.com/icon/free/png-256/visa-3-226460.png" alt="Visa" className="h-20" />
                  <img src="https://cdn.iconscout.com/icon/free/png-256/mastercard-6-226462.png" alt="Mastercard" className="h-20" />
                  <img src="https://cdn.iconscout.com/icon/free/png-256/american-express-44503.png" alt="Amex" className="h-20" />
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    <FaLock className="text-green-600 mr-2" />
                    <span className="text-xs text-gray-600">Your data is protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
