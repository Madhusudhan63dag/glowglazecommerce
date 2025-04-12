import React from 'react'
import { useCart } from '../context/CartContext';

import news from '../utils/image/new.webp';

const Card2 = ({ card }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (event) => {
    event.stopPropagation();
    addToCart({
      id: card.id,
      title: card.name,
      price: card.price,
      imageUrl: card.image
    });
  };

  return (
    <div>
        <div className='bg-white p-5'>
            <div>
                <div>
                    <img src={"https://placehold.co/250x250/000000/FFFFFF/png?text=Product+Image"} alt={card.name} className='' />
                    <div className='relative -top-16 left-4'>
                    <img src={news} alt="Product" className='' />
                    <p className='absolute top-2 left-10 font-bold text-white'>New</p>
                    </div>
                </div>
                <div className='text-center'>
                    <p className=''>{card.name}</p> {/* Updated product description to use card name */}
                    <p className='mt-2 text-gray-600'>Price: ₹{card.price}</p> {/* Updated price information to use card price */}
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Add to Cart
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card2