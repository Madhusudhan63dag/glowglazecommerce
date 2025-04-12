import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Card4 = ({ product }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { addToCart } = useCart();
    
    const toggleReadMore = () => {
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
        <div>
                <div>
                        <div className='flex gap-10 '>
                                <img src={product.imageUrl} alt={product.title} className="w-1/3 h-1/3" />
                                <div className='grid grid-row-4 grid-cols-2 gap-10'>
                                        {product.features.map((feature) => (
                                                <div key={feature.id} className='flex'>
                                                        <img src={feature.url} alt={feature.title} className="w-10 h-10 object-contain mb-3" />
                                                        <p>{feature.title}</p>
                                                </div>
                                        ))}
                                </div>
                        </div>
                        <div>
                                <h1 className='text-2xl font-bold'>{product.title}</h1>
                                <div className='relative'>
                                        <p className='text-sm overflow-hidden'>
                                                {truncatedText}
                                                <button 
                                                    className='text-blue-500 hover:underline ml-2'
                                                    onClick={toggleReadMore}
                                                >
                                                    {isExpanded ? 'Read Less' : 'Read More'}
                                                </button>
                                        </p>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="font-bold">₹{product.price.toFixed(2)}</span>
                                    <button 
                                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-1/2'
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