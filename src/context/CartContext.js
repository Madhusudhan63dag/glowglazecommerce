import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create context
export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Load cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('glowglazCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Add notification state
  const [notification, setNotification] = useState({ show: false, product: null });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('glowglazCart', JSON.stringify(cart));
  }, [cart]);
  
  // Get total number of items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item to cart
        return [...prevCart, {
          id: product.id,
          title: product.title,
          price: product.price || 0,
          image: product.images?.[0] || product.imageUrl || '',
          quantity
        }];
      }
    });
    
    // Show notification
    setNotification({ 
      show: true, 
      product: product 
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, product: null });
    }, 3000);
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const closeCart = () => {
    setIsCartOpen(false);
  };
  
  // Format price to INR
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      cartItemCount,
      cartTotal,
      isCartOpen,
      notification,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      closeCart,
      formatPrice
    }}>
      {children}
      {notification.show && notification.product && <CartNotification product={notification.product} />}
    </CartContext.Provider>
  );
};

// Toast notification component for cart additions
const CartNotification = ({ product }) => {
  const cartContext = useContext(CartContext);
  
  const handleProceedToCheckout = () => {
    // Use window.location instead of navigate to avoid Router context issues
    window.location.href = '/shipping';
  };

  const handleContinueShopping = () => {
    // Close the notification without any redirection
    cartContext.notification.show = false;
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center px-4 sm:px-0">
      {/* Overlay backdrop with subtle blur */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleContinueShopping}></div>
      
      {/* Notification Card */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 ease-in-out
                  border-l-4 border-green-500 animate-fadeIn sm:scale-100 scale-95"
        style={{
          animation: 'fadeInUp 0.3s ease-out',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Success indicator */}
        <div className="absolute top-4 right-4 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="p-5">
          {/* Header */}
          <div className="mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Added to Cart
            </h3>
          </div>
          
          {/* Content */}
          <div className="flex items-center mb-4">
            {/* Product image */}
            {product.image && (
              <div className="mr-4 h-20 w-20 overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate mb-1">{product.title}</p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  Qty: {product.quantity || 1}
                </span>
                <span className="font-semibold text-green-600">{`₹${product.price?.toLocaleString('en-IN') || 0}`}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button 
              onClick={handleContinueShopping}
              className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Continue Shopping
            </button>
            <button 
              onClick={handleProceedToCheckout}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
