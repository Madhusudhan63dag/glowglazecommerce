import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaCheckCircle, FaShippingFast, FaEnvelope, FaBox, FaHeadset, FaPhone, FaRegCreditCard } from 'react-icons/fa';
import SEO from '../components/SEO';
import productData from '../utils/data/product'; // Import product data

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { formatPrice, clearCart } = useCart();
  const [orderData, setOrderData] = useState(null);
  
  // Get order data from location state or localStorage
  useEffect(() => {
    // First try to get from location state (React Router)
    if (location.state) {
      console.log("Found order data in location state");
      setOrderData(location.state);
      // Save to localStorage as backup
      localStorage.setItem('lastCompletedOrder', JSON.stringify(location.state));
      return;
    }
    
    // Second try to get from URL parameters
    const orderRef = searchParams.get('ref');
    if (orderRef) {
      console.log("Found order ref in URL params:", orderRef);
      // Try to get the rest from localStorage
      const savedOrder = localStorage.getItem('lastCompletedOrder');
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          setOrderData({
            ...parsedOrder,
            orderReference: orderRef
          });
          return;
        } catch (error) {
          console.error("Error parsing saved order:", error);
        }
      }
    }
    
    // Last resort: try localStorage directly
    const savedOrder = localStorage.getItem('lastCompletedOrder');
    if (savedOrder) {
      try {
        console.log("Using saved order from localStorage");
        setOrderData(JSON.parse(savedOrder));
        return;
      } catch (error) {
        console.error("Error parsing saved order:", error);
      }
    }
    
    // No order data found, redirect after a short delay
    const timer = setTimeout(() => {
      console.log("No order data found, redirecting to home");
      navigate('/');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [location.state, navigate, searchParams]);
  
  // Clear pending checkout when component mounts
  useEffect(() => {
    localStorage.removeItem('pendingCheckout');
    // Also clear the cart to be safe
    clearCart();
  }, [clearCart]);
  
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

  // Show loading while getting order data
  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Extract order data
  const { 
    orderReference, 
    formData, 
    paymentMethod, 
    cartItems, 
    orderTotal, 
    cartTotal,
    shippingCost,
    discountAmount,
    discountApplied,
    paymentId 
  } = orderData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO 
        title="Order Confirmation - Thank You | GlowGlaz"
        description="Thank you for your purchase! Your order has been successfully placed."
        noindex={true}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Order Success Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 py-6 px-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="opacity-90">Your order has been successfully placed and is being processed.</p>
          </div>

          <div className="p-8">
            {/* Success Animation */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-5xl" />
              </div>
            </div>
            
            {/* Order Details */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Confirmation</h2>
                <p className="text-gray-600">We've received your order and will begin processing it right away.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Order Reference</h3>
                    <p className="text-xl font-bold text-gray-800">{orderReference}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Order Date</h3>
                    <p className="text-gray-800">{new Date().toLocaleDateString('en-IN', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Payment Method</h3>
                    <p className="text-gray-800 flex items-center">
                      {paymentMethod === 'razorpay' && <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-4 h-4 mr-2" />}
                      {paymentMethod === 'card' && <FaRegCreditCard className="mr-2" />}
                      {paymentMethod === 'cod' && <span className="mr-2">💵</span>}
                      {paymentMethod === 'razorpay' ? 'Razorpay' : 
                       paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Expected Delivery</h3>
                    <p className="text-gray-800">{getDeliveryDateRange()}</p>
                  </div>
                </div>
                
                {paymentId && (
                  <div className="border-t border-gray-200 mt-6 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Payment ID</h3>
                    <p className="text-gray-800 font-mono">{paymentId}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 pb-2 border-b">Order Summary</h3>
              <div className="space-y-4">
                {cartItems && cartItems.map(item => (
                  <div key={item.id} className="flex py-3 border-b last:border-b-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-1">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-full w-full object-contain object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h4 className="text-blue-700">{item.title}</h4>
                        <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <div className="mt-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                  </div>
                  
                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>YouTube Discount (10%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-700">{formatPrice(orderTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            {formData && (
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 pb-2 border-b">Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                    <p className="text-gray-800 font-medium">{formData.firstName} {formData.lastName}</p>
                    <p className="text-gray-600">{formData.email}</p>
                    <p className="text-gray-600">{formData.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                    <p className="text-gray-800">{formData.address}</p>
                    <p className="text-gray-800">{formData.city}, {formData.state} {formData.pincode}</p>
                    <p className="text-gray-800">India</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* What's Next Section */}
            <div className="mb-8 border-t pt-8">
              <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <FaEnvelope className="text-blue-600 text-lg" />
                  </div>
                  <h4 className="font-medium mb-2">Order Confirmation</h4>
                  <p className="text-sm text-gray-600">We've sent a confirmation email to {formData?.email}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                    <FaBox className="text-yellow-600 text-lg" />
                  </div>
                  <h4 className="font-medium mb-2">Order Processing</h4>
                  <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <FaShippingFast className="text-green-600 text-lg" />
                  </div>
                  <h4 className="font-medium mb-2">Shipping Update</h4>
                  <p className="text-sm text-gray-600">We'll notify you when your order ships</p>
                </div>
              </div>
            </div>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  navigate('/');
                  window.location.reload();
                }} 
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
              {/* <button 
                onClick={() => navigate('/account')} 
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                View Your Orders
              </button> */}
            </div>
          </div>
          
          {/* Customer Support Section */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <FaHeadset className="text-gray-500 text-xl mr-2" />
                <div>
                  <h4 className="font-medium text-gray-700">Need Help?</h4>
                  <p className="text-gray-500 text-sm">Contact our customer support</p>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="mailto:support@glowglaz.com" className="text-blue-600 hover:text-blue-800 flex items-center">
                  <FaEnvelope className="mr-2" /> Email Support
                </a>
                <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-800 flex items-center">
                  <FaPhone className="mr-2" /> Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">You Might Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Fix: Access productDetailData correctly from the imported object */}
            {productData.productDetailData && productData.productDetailData
              .slice(0, 4)
              .map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="p-2 h-40 bg-gray-50 flex items-center justify-center">
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{product.title}</h4>
                    <p className="text-blue-600 font-medium">{product.price}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;