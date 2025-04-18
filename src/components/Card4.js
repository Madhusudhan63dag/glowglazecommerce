import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Card4 = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { addToCart } = useCart();
    
    const toggleReadMore = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    }
    
    const truncatedText = isExpanded ? product.description : product.description.substr(0, 150) + '...';

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl
        });
    }

    return (
        <div className="p-2 sm:p-4 bg-white rounded-lg shadow-sm">
            <div>
                {/* Product content with mobile-friendly flexbox that switches to column on small screens */}
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10'>
                    <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="w-full sm:w-1/3 rounded-lg object-cover mb-4 sm:mb-0" 
                    />
                    
                    {/* Features grid - 2 columns on mobile, 2x2 grid on larger screens */}
                    <div className='grid grid-cols-2 gap-2 sm:gap-4 md:gap-6'>
                        {product.features.map((feature) => (
                            <div key={feature.id} className='flex items-center space-x-2'>
                                <img 
                                    src={feature.url} 
                                    alt={feature.title} 
                                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain" 
                                />
                                <p className="text-xs sm:text-sm md:text-base">{feature.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 sm:mt-6">
                    <h1 className='text-lg sm:text-xl md:text-2xl font-bold mb-2'>{product.title}</h1>
                    <div className='relative'>
                        <p className='text-xs sm:text-sm overflow-hidden'>
                            {truncatedText}
                            <button 
                                className='text-blue-500 hover:underline ml-2 text-xs sm:text-sm'
                                onClick={toggleReadMore}
                            >
                                {isExpanded ? 'Read Less' : 'Read More'}
                            </button>
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-2 sm:gap-0">
                        <span className="font-bold text-base sm:text-lg md:text-xl">₹{product.price.toFixed(2)}</span>
                        <button 
                            className='bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base sm:w-1/2'
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card4;