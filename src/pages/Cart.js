import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProceedToCheckoutButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/shipping')}
      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
    >
      Proceed to Checkout
    </button>
  );
};

export default ProceedToCheckoutButton;