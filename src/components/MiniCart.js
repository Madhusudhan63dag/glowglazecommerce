import React from 'react';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const MiniCart = () => {
  const { 
    cart, 
    cartTotal, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity,
    formatPrice
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={toggleCart}
      ></div>
      
      {/* Cart panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        {/* Cart header */}
        <div className="px-4 py-3 bg-gray-100 flex justify-between items-center border-b">
          <h3 className="font-bold text-lg flex items-center">
            <FaShoppingBag className="mr-2" /> 
            Shopping Cart ({cart.length})
          </h3>
          <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        
        {/* Cart body */}
        <div className="flex-grow overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <FaShoppingBag className="mx-auto text-gray-300 text-5xl mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map(item => (
                <li key={item.id} className="py-4 flex">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3 className="line-clamp-1">{item.title}</h3>
                      <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border-r"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border-l"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <button 
                        type="button" 
                        className="font-medium text-red-600 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Cart footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between text-lg font-medium mb-4">
              <p>Subtotal:</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
            <Link to="/checkout">
              <button
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
                onClick={toggleCart}
              >
                Proceed to Checkout
              </button>
            </Link>
            <button
              className="w-full bg-white text-blue-600 border border-blue-600 mt-2 py-3 px-4 rounded-md hover:bg-blue-50 font-medium"
              onClick={toggleCart}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCart;
