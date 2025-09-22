import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaLock, FaShippingFast, FaCreditCard, FaArrowLeft, FaCheckCircle, FaShieldAlt, FaMedal, FaRegCreditCard, FaEnvelope, FaBox, FaHeadset, FaPhone, FaMobileAlt, FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';
import SEO from '../components/SEO';
import API_main from '../utils/config/api';

// Backend API URL
const API_URL = API_main;

// Custom Popup Component
const CustomPopup = ({ isOpen, onClose, title, message, type = 'info', icon: CustomIcon }) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const DefaultIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaTimes />;
      default:
        return <FaInfoCircle />;
    }
  };

  const IconComponent = CustomIcon || DefaultIcon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border-l-4 ${getColors()}`}>
        <div className="p-6">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${getIconColor()} text-2xl mr-4 mt-1`}>
              <IconComponent />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <div className="text-gray-700 whitespace-pre-line">{message}</div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const { cart, cartTotal, formatPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // Popup state
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    icon: null
  });

  const showPopup = (title, message, type = 'info', icon = null) => {
    setPopup({
      isOpen: true,
      title,
      message,
      type,
      icon
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  // Get user data from location state or localStorage
  const getUserData = () => {
    if (location.state && location.state.formData) {
      return location.state.formData;
    }
    
    // Try to get from localStorage as fallback
    const pendingCheckout = localStorage.getItem('pendingCheckout');
    if (pendingCheckout) {
      try {
        const { formData } = JSON.parse(pendingCheckout);
        return formData || {};
      } catch (error) {
        console.error('Error parsing saved checkout data', error);
      }
    }
    
    return {};
  };

  const [formData, setFormData] = useState(getUserData);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Phone number state (separate from formData for real-time validation)
  const [phoneNumber, setPhoneNumber] = useState(formData.phone || '');
  
  // OTP verification states for COD
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  
  // NEW: Bypass verification state
  const [verificationBypassed, setVerificationBypassed] = useState(false);
  const [bypassReason, setBypassReason] = useState('');
  
  // Razorpay integration states
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Redirect if no shipping information
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      navigate('/');
      return;
    }
    
    // If we don't have user data, redirect to auth/shipping page
    if (!formData || Object.keys(formData).length === 0 || !formData.email) {
      navigate('/shipping');
    }
  }, [cart, navigate, orderComplete, formData]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Calculate totals
  const shippingCost = cartTotal >= 3000 ? 0 : 99;
  const orderTotal = cartTotal + shippingCost;

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone);
  };

  // Handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
    setPhoneNumber(value);
    
    // Clear phone error when user types
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
    
    // Reset OTP states if phone number changes
    if (otpSent || otpVerified || verificationBypassed) {
      setOtpSent(false);
      setOtpVerified(false);
      setShowOtpInput(false);
      setOtp('');
      setOtpError('');
      setVerificationBypassed(false);
      setBypassReason('');
    }
  };

  // Send OTP for COD verification - WITH BYPASS ON ERROR
  const sendOtp = async () => {
    // Validate phone number first
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
      return;
    }

    try {
      setOtpError('');
      setOtpSent(false);

      // Using the correct API endpoint from your backend
      const response = await fetch(`${API_URL}/generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber // Match the parameter name from your API
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setShowOtpInput(true);
        setResendTimer(60); // 60 seconds countdown
        showPopup(
          'OTP Sent Successfully!',
          'Please check your phone for the verification code.',
          'success',
          FaCheckCircle
        );
      } else {
        // BYPASS: If OTP generation fails, bypass verification
        console.warn('OTP generation failed, bypassing verification:', data.message);
        setVerificationBypassed(true);
        setBypassReason('OTP service temporarily unavailable');
        setFormData(prev => ({ ...prev, phone: phoneNumber }));
        showPopup(
          'SMS Service Unavailable',
          'SMS service is temporarily unavailable. Your order will proceed without phone verification.',
          'warning',
          FaExclamationTriangle
        );
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // BYPASS: On network/server error, bypass verification
      console.warn('OTP generation error, bypassing verification');
      setVerificationBypassed(true);
      setBypassReason('Network error during verification');
      setFormData(prev => ({ ...prev, phone: phoneNumber }));
      setOtpError('');
      showPopup(
        'Technical Issue',
        'Unable to send verification code due to technical issues. Your order will proceed without phone verification.',
        'warning',
        FaExclamationTriangle
      );
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 4) { // Your API generates 4-digit OTP
      setOtpError('Please enter a valid 4-digit OTP');
      return;
    }

    try {
      setOtpVerifying(true);
      setOtpError('');

      // Using the correct API endpoint from your backend
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber, // Match the parameter name from your API
          otp: otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        setShowOtpInput(false);
        // Update formData with verified phone number
        setFormData(prev => ({ ...prev, phone: phoneNumber }));
        showPopup(
          'Phone Verified Successfully!',
          'Your phone number has been verified. You can now place your COD order.',
          'success',
          FaCheckCircle
        );
      } else {
        setOtpError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setOtpVerifying(false);
    }
  };

  // Process COD order - UPDATED to handle bypass
  const processCodOrder = async () => {
    // Check if either verified OR bypassed
    if (!otpVerified && !verificationBypassed) {
      setOtpError('Please verify your phone number first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate order reference
      const orderRef = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Set order success flag
      sessionStorage.setItem('orderSuccessful', 'true');
      
      // Send order confirmation email with updated formData that includes phone
      const updatedFormData = { ...formData, phone: phoneNumber };
      await sendOrderConfirmationEmail(orderRef, 'COD', updatedFormData);
      
      // Clear cart and pending checkout data
      clearCart();
      localStorage.removeItem('pendingCheckout');
      
      // Create order data for ThankYou page
      const orderData = {
        orderReference: orderRef,
        paymentId: 'COD',
        formData: updatedFormData,
        paymentMethod,
        cartItems: [...cart],
        cartTotal,
        orderTotal,
        shippingCost,
        discountAmount: 0,
        discountApplied: false,
        // Add bypass info if applicable
        ...(verificationBypassed && { 
          verificationBypassed: true, 
          bypassReason: bypassReason 
        })
      };
      
      // Store in localStorage
      localStorage.setItem('lastCompletedOrder', JSON.stringify(orderData));
      
      // Navigate to thank you page
      window.location.href = `/thank-you?ref=${orderRef}`;
    } catch (error) {
      console.error('Error processing COD order:', error);
      showPopup(
        'Order Processing Failed',
        'Failed to process order. Please try again.',
        'error'
      );
      setIsSubmitting(false);
    }
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
          customerPhone: phoneNumber || formData.phone,
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
      showPopup(
        'Order Creation Failed',
        'Failed to create order. Please try again.',
        'error'
      );
      setPaymentProcessing(false);
      return null;
    }
  };

  // Display Razorpay payment form
  const displayRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      showPopup(
        'Payment Gateway Error',
        'Razorpay SDK failed to load. Please check your internet connection.',
        'error'
      );
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
      handler: async function (response) {
        try {
          setIsSubmitting(true);
          console.log("Razorpay payment successful, verifying payment...");
          
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
            console.log("Payment verification successful, preparing for navigation...");
            
            // Generate a unique order reference/number
            const orderRef = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
            
            // Set order success flag to prevent abandoned cart email
            sessionStorage.setItem('orderSuccessful', 'true');
            
            // Set order complete state
            setOrderComplete(true);
            
            // Send order confirmation email with phone number
            const updatedFormData = { ...formData, phone: phoneNumber || formData.phone };
            await sendOrderConfirmationEmail(orderRef, response.razorpay_payment_id, updatedFormData);
            
            // Clear cart and pending checkout data
            clearCart();
            localStorage.removeItem('pendingCheckout');
            
            // Create order data object for ThankYou page
            const orderData = {
              orderReference: orderRef,
              paymentId: response.razorpay_payment_id,
              formData: updatedFormData,
              paymentMethod,
              cartItems: [...cart],
              cartTotal,
              orderTotal,
              shippingCost,
              discountAmount: 0,
              discountApplied: false
            };
            
            // Store in localStorage as fallback
            localStorage.setItem('lastCompletedOrder', JSON.stringify(orderData));
            console.log("Order data saved to localStorage, redirecting...");
            
            // Use direct URL navigation with query parameter
            window.location.href = `/thank-you?ref=${orderRef}`;
          } else {
            showPopup(
              'Payment Verification Failed',
              'Payment verification failed. Please contact support.',
              'error'
            );
            setIsSubmitting(false);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          showPopup(
            'Payment Verification Error',
            'Payment verification failed. Please contact support.',
            'error'
          );
          setIsSubmitting(false);
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: phoneNumber || formData.phone,
      },
      notes: {
        address: formData.address
      },
      theme: {
        color: '#4CAF50'
      },
      modal: {
        ondismiss: function() {
          console.log('Razorpay modal closed');
          setPaymentProcessing(false);
          setIsSubmitting(false);
        }
      }
    };
    
    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        showPopup(
          'Payment Failed',
          `Payment failed: ${response.error.description}`,
          'error'
        );
        setPaymentProcessing(false);
        setIsSubmitting(false);
      });
      paymentObject.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      showPopup(
        'Payment Gateway Error',
        'Failed to open payment gateway. Please try again.',
        'error'
      );
      setPaymentProcessing(false);
      setIsSubmitting(false);
    }
  };

  // Send order confirmation email - Updated to match API structure
  const sendOrderConfirmationEmail = async (orderRef, paymentId, customerFormData = formData) => {
    try {
      // Structure data according to API requirements
      const emailData = {
        customerEmail: customerFormData.email,
        orderDetails: {
          orderNumber: orderRef,
          products: cart.map(item => ({
            name: item.title,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: orderTotal,
          currency: "₹",
          paymentMethod: paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery',
          paymentId: paymentId
        },
        customerDetails: {
          firstName: customerFormData.firstName,
          lastName: customerFormData.lastName,
          email: customerFormData.email,
          phone: customerFormData.phone,
          address: customerFormData.address,
          apartment: customerFormData.apartment || '',
          city: customerFormData.city,
          state: customerFormData.state,
          zip: customerFormData.pincode,
          country: customerFormData.country || 'India'
        }
      };

      console.log('Sending order confirmation email with data:', emailData);

      const response = await fetch(`${API_URL}/send-order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      if (!result.success) {
        console.error('Failed to send order confirmation email:', result.message);
        
        // Show popup for email failure
        showPopup(
          'Order Placed Successfully!',
          `Order Number: ${orderRef}\n\nHowever, we couldn't send your confirmation email due to technical issues.\n\n📞 For order updates, please contact us:\n• Phone: +91 12345 67890\n• Email: support@glowglaz.com\n• WhatsApp: +91 98765 43210\n\nPlease save your order number: ${orderRef}`,
          'warning',
          FaExclamationTriangle
        );
      } else {
        console.log('Order confirmation email sent successfully');
      }
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      
      // Show popup for email sending error
      showPopup(
        'Order Placed Successfully!',
        `Order Number: ${orderRef}\n\nHowever, we couldn't send your confirmation email due to network issues.\n\n📞 For order updates and confirmation, please contact us:\n• Phone: +91 12345 67890\n• Email: support@glowglaz.com\n• WhatsApp: +91 98765 43210\n\nPlease save your order number: ${orderRef}\n\nWe will manually send you the order details within 2 hours.`,
        'warning',
        FaExclamationTriangle
      );
    }
  };

  // Handle form submission - UPDATED for bypass logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number for all payment methods
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
      return;
    }
    
    if (paymentMethod === 'razorpay') {
      // Create Razorpay order and display payment form
      const orderData = await createRazorpayOrder();
      if (orderData) {
        await displayRazorpayPayment(orderData);
      }
    } else if (paymentMethod === 'cod') {
      // Handle Cash on Delivery with OTP verification OR bypass
      if (!otpVerified && !verificationBypassed) {
        // Send OTP first (will auto-bypass if fails)
        await sendOtp();
      } else {
        // OTP already verified OR bypassed, process order
        await processCodOrder();
      }
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Processing...</h2>
          <p className="text-gray-600">Please wait while we redirect you to the confirmation page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Secure Checkout - GlowGlaz" description="Complete your order with our secure checkout process. Multiple payment options available." keywords="checkout, payment, secure, order, GlowGlaz" />

      {/* Custom Popup */}
      <CustomPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        icon={popup.icon}
      />

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
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
                <p className="text-xs text-gray-500">On orders over ₹3,000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Payment Form */}
          <div className="lg:w-2/3">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaPhone className="mr-2 text-blue-600" />
                Contact Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter your 10-digit mobile number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Required for order confirmation and delivery updates
                  {paymentMethod === 'cod' && ' • Phone verification attempted for COD orders'}
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-blue-600" />
                Payment Method
              </h2>
              
              <div className="space-y-4">
                {/* Razorpay Payment */}
                <div className="border rounded-lg p-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        // Reset OTP states when switching from COD
                        setOtpVerified(false);
                        setShowOtpInput(false);
                        setOtpSent(false);
                        setOtp('');
                        setOtpError('');
                        setVerificationBypassed(false);
                        setBypassReason('');
                      }}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <FaRegCreditCard className="text-lg mr-2 text-blue-600" />
                      <span className="font-medium">Credit/Debit Card, UPI, Net Banking</span>
                    </div>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">Powered by Razorpay</p>
                </div>

                {/* Cash on Delivery */}
                <div className="border rounded-lg p-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <FaBox className="text-lg mr-2 text-green-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                  </label>
                  <p className="text-sm text-gray-600 ml-6 mt-1">
                    Pay when you receive your order • Phone verification will be attempted
                  </p>
                </div>
              </div>
            </div>

            {/* OTP Verification Section for COD */}
            {paymentMethod === 'cod' && !otpVerified && !verificationBypassed && phoneNumber && validatePhoneNumber(phoneNumber) && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaMobileAlt className="mr-2 text-orange-600" />
                  Phone Verification for COD
                </h3>
                <p className="text-gray-600 mb-4">
                  We'll attempt to verify your phone number: <strong>+91 {phoneNumber}</strong>
                  <br />
                  <small className="text-gray-500">If verification fails, your order will proceed without it.</small>
                </p>
                
                {!showOtpInput ? (
                  <button
                    onClick={sendOtp}
                    disabled={otpSent}
                    className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-lg font-medium disabled:opacity-50"
                  >
                    {otpSent ? 'Sending...' : 'Verify Phone Number'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter 4-digit OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="Enter OTP"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-2xl tracking-widest"
                        maxLength={4}
                      />
                    </div>
                    
                    {otpError && (
                      <p className="text-red-600 text-sm">{otpError}</p>
                    )}
                    
                    <div className="flex gap-3">
                      <button
                        onClick={verifyOtp}
                        disabled={!otp || otp.length !== 4 || otpVerifying}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {otpVerifying ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          'Verify OTP'
                        )}
                      </button>
                      
                      <button
                        onClick={sendOtp}
                        disabled={resendTimer > 0}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Phone Verification Success for COD */}
            {paymentMethod === 'cod' && otpVerified && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-600 text-xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Phone Number Verified!</h3>
                    <p className="text-green-700">+91 {phoneNumber} • Ready to place COD order</p>
                  </div>
                </div>
              </div>
            )}

            {/* NEW: Verification Bypassed Notice */}
            {paymentMethod === 'cod' && verificationBypassed && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-yellow-600 text-xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Verification Skipped</h3>
                    <p className="text-yellow-700">
                      +91 {phoneNumber} • {bypassReason}
                      <br />
                      <small>Your COD order will proceed without phone verification.</small>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button - UPDATED for bypass logic */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                isSubmitting || 
                paymentProcessing || 
                !phoneNumber || 
                !validatePhoneNumber(phoneNumber) ||
                (paymentMethod === 'cod' && !otpVerified && !verificationBypassed)
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || paymentProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaLock className="mr-2" />
                  {paymentMethod === 'cod' ? 
                    (otpVerified ? 'Place COD Order' : 
                     verificationBypassed ? 'Place COD Order (Unverified)' : 
                     'Verify Phone to Continue') : 
                    'Proceed to Payment'
                  }
                </>
              )}
            </button>
          </div>

          {/* Order Summary Sidebar - UPDATED for bypass status */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaShoppingCart className="mr-2 text-blue-600" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* Phone Verification Status - UPDATED for bypass */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Phone Number:</span>
                  {phoneNumber && validatePhoneNumber(phoneNumber) ? (
                    <span className="text-green-600 text-sm">+91 {phoneNumber}</span>
                  ) : (
                    <span className="text-red-600 text-sm">Required</span>
                  )}
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium">COD Status:</span>
                    {otpVerified ? (
                      <span className="text-green-600 text-sm flex items-center">
                        <FaCheckCircle className="mr-1" />
                        Verified
                      </span>
                    ) : verificationBypassed ? (
                      <span className="text-yellow-600 text-sm flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        Bypassed
                      </span>
                    ) : (
                      <span className="text-orange-600 text-sm">Pending</span>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Support */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <FaHeadset className="mr-2 text-blue-600" />
                  Need Help?
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-gray-400" />
                    <span>+91 93922 77389</span>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    <span>customercareproductcenter@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              {formData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-800">Shipping To:</h3>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.pincode}</p>
                    {phoneNumber && <p>+91 {phoneNumber}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;