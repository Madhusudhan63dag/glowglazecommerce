import React, { createContext, useState, useContext, useEffect } from 'react';

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
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      bg-white border-l-4 border-green-500 text-gray-700 p-4 rounded-lg shadow-xl z-50 
      animate-slide-up max-w-md w-full flex items-center">
      
      {/* Product image */}
      {product.image && (
        <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img 
            src={product.image} 
            alt={product.title} 
            className="h-full w-full object-cover object-center"
          />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-green-600">Added to Cart!</h3>
          <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            Success
          </div>
        </div>
        
        <p className="text-sm line-clamp-2">{product.title}</p>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">Qty: {product.quantity || 1}</span>
          <span className="font-medium">{`₹${product.price?.toLocaleString('en-IN') || 0}`}</span>
        </div>
      </div>
    </div>
  );
};
