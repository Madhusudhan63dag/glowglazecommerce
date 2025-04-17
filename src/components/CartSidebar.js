import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { cart, formatPrice } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    setIsOpen(false); // Close the sidebar first if applicable
    navigate('/shipping');
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform`}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Your Cart</h2>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center">
              <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md" />
              <div className="ml-4">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button 
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;